import React, { type ReactElement } from 'react'
import cors from 'cors'
import express from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import { chromium } from 'playwright'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderToStaticMarkup } from 'react-dom/server'
import { z } from 'zod'
import {
  createCoverLetterFromResume,
  createDefaultCoverLetterData,
  defaultResumeData,
  normalizeCoverLetterData,
  normalizeResumeData,
} from '../../src/lib/defaults'
import {
  documentPageDimensions,
  getDocumentFontStylesheet,
} from '../../src/lib/documents'
import type {
  CoverLetterData,
  DocumentStyleSettings,
  ResumeData,
} from '../../src/lib/documents'
import { ClassicCoverLetterPreview, classicCoverLetterStyles } from '../../src/templates/classicCv/ClassicCoverLetterPreview'
import {
  ClassicCvPreview,
  classicCvStyles,
} from '../../src/templates/classicCv/ClassicCvPreview'

const prisma = new PrismaClient()
const app = express()
const port = Number(process.env.PORT || 8787)

const linkSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  url: z.string(),
})

const resumeEntrySchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  subtitle: z.string().optional(),
  date: z.string(),
  bullets: z.array(z.string()),
})

const documentTypographySchema = z
  .object({
    nameSize: z.number().optional(),
    nameBold: z.boolean().optional(),
    headerTextSize: z.number().optional(),
    headerTextBold: z.boolean().optional(),
    sectionTitleSize: z.number().optional(),
    sectionTitleBold: z.boolean().optional(),
    subheadingSize: z.number().optional(),
    subheadingBold: z.boolean().optional(),
    bodySize: z.number().optional(),
    bodyBold: z.boolean().optional(),
    tagSize: z.number().optional(),
    tagBold: z.boolean().optional(),
  })
  .optional()

const documentStyleSettingsSchema = z.object({
  accentColor: z.string(),
  fontFamily: z.enum(['charter', 'inter', 'georgia', 'garamond', 'lato']),
  pageSize: z.enum(['a4', 'letter']),
  gutter: z.number(),
  margins: z.object({
    top: z.number(),
    right: z.number(),
    bottom: z.number(),
    left: z.number(),
  }),
  typography: documentTypographySchema,
})

const resumeSectionIdSchema = z.enum([
  'summary',
  'workExperience',
  'selectedProjects',
  'achievements',
  'skills',
  'tools',
  'education',
])

const resumeSectionTitlesSchema = z
  .object({
    summary: z.string().optional(),
    workExperience: z.string().optional(),
    selectedProjects: z.string().optional(),
    achievements: z.string().optional(),
    skills: z.string().optional(),
    tools: z.string().optional(),
    education: z.string().optional(),
  })
  .optional()

const resumeDataSchema = z.object({
  personal: z.object({
    fullName: z.string(),
    headline: z.string(),
    location: z.string(),
    phone: z.string(),
    email: z.string(),
    links: z.array(linkSchema),
  }),
  styleSettings: documentStyleSettingsSchema.optional(),
  summary: z.string(),
  sectionOrder: z.array(resumeSectionIdSchema),
  sectionTitles: resumeSectionTitlesSchema,
  hiddenSections: z.array(resumeSectionIdSchema),
  workExperience: z.array(resumeEntrySchema),
  selectedProjects: z.array(resumeEntrySchema),
  achievements: z.array(resumeEntrySchema),
  skills: z.object({
    technical: z.union([z.string(), z.array(z.string())]),
    soft: z.union([z.string(), z.array(z.string())]),
  }),
  tools: z.union([z.string(), z.array(z.string())]),
  education: z.object({
    degree: z.string(),
    institution: z.string(),
    date: z.string(),
  }),
})

const coverLetterDataSchema = z.object({
  senderName: z.string(),
  senderLocation: z.string(),
  senderPhone: z.string(),
  senderEmail: z.string(),
  senderLinks: z.array(linkSchema),
  styleSettings: documentStyleSettingsSchema.optional(),
  recipientName: z.string(),
  recipientTitle: z.string(),
  recipientCompany: z.string(),
  recipientAddress: z.string(),
  date: z.string(),
  subject: z.string(),
  greeting: z.string(),
  paragraphs: z.array(z.string()),
  closing: z.string(),
  signature: z.string(),
})

const resumeUpdateSchema = z.object({
  title: z.string().min(1),
  templateKey: z.string().min(1),
  tags: z.array(z.string()),
  data: resumeDataSchema,
})

const coverLetterUpdateSchema = z.object({
  title: z.string().min(1),
  tags: z.array(z.string()),
  linkedResumeId: z.string().nullable(),
  data: coverLetterDataSchema,
})

type ErrorWithStatus = Error & { status?: number }

app.use(cors({ origin: true }))
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_request, response) => {
  response.json({ ok: true })
})

app.get('/api/resumes', async (_request, response, next) => {
  try {
    let resumes = await prisma.resume.findMany({
      orderBy: { updatedAt: 'desc' },
    })

    if (resumes.length === 0) {
      const seededResume = await prisma.resume.create({
        data: {
          title: `${defaultResumeData.personal.fullName} Resume`,
          templateKey: 'classic',
          data: structuredClone(defaultResumeData),
        },
      })

      resumes = [seededResume]
    }

    response.json(
      resumes.map((resume) => ({
        id: resume.id,
        title: resume.title,
        templateKey: resume.templateKey,
        tags: normalizeResumeTags(resume.tags),
        updatedAt: resume.updatedAt.toISOString(),
      })),
    )
  } catch (error) {
    next(error)
  }
})

app.post('/api/resumes', async (_request, response, next) => {
  try {
    const resume = await prisma.resume.create({
      data: {
        title: `${defaultResumeData.personal.fullName} Resume`,
        templateKey: 'classic',
        data: structuredClone(defaultResumeData),
      },
    })

    response.status(201).json(serializeResume(resume))
  } catch (error) {
    next(error)
  }
})

app.get('/api/resumes/:id', async (request, response, next) => {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: request.params.id },
    })

    if (!resume) {
      throw createNotFound('Resume not found.')
    }

    response.json(serializeResume(resume))
  } catch (error) {
    next(error)
  }
})

app.post('/api/resumes/:id/duplicate', async (request, response, next) => {
  try {
    const source = await prisma.resume.findUnique({
      where: { id: request.params.id },
    })

    if (!source) {
      throw createNotFound('Resume not found.')
    }

    const resume = await prisma.resume.create({
      data: {
        title: `${source.title} (Copy)`,
        templateKey: source.templateKey,
        tags: normalizeResumeTags(source.tags),
        data: structuredClone(
          normalizeResumeData(resumeDataSchema.parse(source.data)),
        ),
      },
    })

    response.status(201).json(serializeResume(resume))
  } catch (error) {
    next(error)
  }
})

app.put('/api/resumes/:id', async (request, response, next) => {
  try {
    const payload = resumeUpdateSchema.parse(request.body)
    const resume = await prisma.resume.update({
      where: { id: request.params.id },
      data: {
        title: payload.title,
        templateKey: payload.templateKey,
        tags: normalizeResumeTags(payload.tags),
        data: normalizeResumeData(payload.data),
      },
    })

    response.json(serializeResume(resume))
  } catch (error) {
    next(error)
  }
})

app.delete('/api/resumes/:id', async (request, response, next) => {
  try {
    await prisma.resume.delete({
      where: { id: request.params.id },
    })

    response.status(204).send()
  } catch (error) {
    next(error)
  }
})

app.get('/api/resumes/:id/pdf', async (request, response, next) => {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: request.params.id },
    })

    if (!resume) {
      throw createNotFound('Resume not found.')
    }

    const resumeData = normalizeResumeData(resumeDataSchema.parse(resume.data))
    const pdf = await renderPdf(
      buildDocumentHtml(
        `${resume.title}.pdf`,
        classicCvStyles,
        <ClassicCvPreview resume={resumeData} />,
        resumeData.styleSettings,
      ),
    )

    response.setHeader('Content-Type', 'application/pdf')
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${slugify(resume.title)}.pdf"`,
    )
    response.send(pdf)
  } catch (error) {
    next(error)
  }
})

app.get('/api/cover-letters', async (_request, response, next) => {
  try {
    const coverLetters = await prisma.coverLetter.findMany({
      orderBy: { updatedAt: 'desc' },
    })

    response.json(
      coverLetters.map((coverLetter) => ({
        id: coverLetter.id,
        title: coverLetter.title,
        tags: normalizeResumeTags(coverLetter.tags),
        linkedResumeId: coverLetter.linkedResumeId,
        updatedAt: coverLetter.updatedAt.toISOString(),
      })),
    )
  } catch (error) {
    next(error)
  }
})

app.post('/api/cover-letters', async (_request, response, next) => {
  try {
    const coverLetter = await prisma.coverLetter.create({
      data: {
        title: 'New Cover Letter',
        linkedResumeId: null,
        data: createDefaultCoverLetterData(),
      },
    })

    response.status(201).json(serializeCoverLetter(coverLetter))
  } catch (error) {
    next(error)
  }
})

app.get('/api/cover-letters/:id', async (request, response, next) => {
  try {
    const coverLetter = await prisma.coverLetter.findUnique({
      where: { id: request.params.id },
    })

    if (!coverLetter) {
      throw createNotFound('Cover letter not found.')
    }

    response.json(serializeCoverLetter(coverLetter))
  } catch (error) {
    next(error)
  }
})

app.put('/api/cover-letters/:id', async (request, response, next) => {
  try {
    const payload = coverLetterUpdateSchema.parse(request.body)
    const coverLetter = await prisma.coverLetter.update({
      where: { id: request.params.id },
      data: {
        title: payload.title,
        tags: normalizeResumeTags(payload.tags),
        linkedResumeId: payload.linkedResumeId,
        data: normalizeCoverLetterData(payload.data),
      },
    })

    response.json(serializeCoverLetter(coverLetter))
  } catch (error) {
    next(error)
  }
})

app.delete('/api/cover-letters/:id', async (request, response, next) => {
  try {
    await prisma.coverLetter.delete({
      where: { id: request.params.id },
    })

    response.status(204).send()
  } catch (error) {
    next(error)
  }
})

app.get('/api/cover-letters/:id/pdf', async (request, response, next) => {
  try {
    const coverLetter = await prisma.coverLetter.findUnique({
      where: { id: request.params.id },
    })

    if (!coverLetter) {
      throw createNotFound('Cover letter not found.')
    }

    const coverLetterData = normalizeCoverLetterData(
      coverLetterDataSchema.parse(coverLetter.data),
    )
    const pdf = await renderPdf(
      buildDocumentHtml(
        `${coverLetter.title}.pdf`,
        classicCoverLetterStyles,
        <ClassicCoverLetterPreview coverLetter={coverLetterData} />,
        coverLetterData.styleSettings,
      ),
    )

    response.setHeader('Content-Type', 'application/pdf')
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${slugify(coverLetter.title)}.pdf"`,
    )
    response.send(pdf)
  } catch (error) {
    next(error)
  }
})

app.post('/api/cover-letters/from-resume/:resumeId', async (request, response, next) => {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: request.params.resumeId },
    })

    if (!resume) {
      throw createNotFound('Resume not found.')
    }

    const coverLetter = await prisma.coverLetter.create({
      data: {
        title: `${resume.title} Cover Letter`,
        linkedResumeId: resume.id,
        data: createCoverLetterFromResume(
          normalizeResumeData(resumeDataSchema.parse(resume.data)),
        ),
      },
    })

    response.status(201).json(serializeCoverLetter(coverLetter))
  } catch (error) {
    next(error)
  }
})

const currentFilePath = fileURLToPath(import.meta.url)
const currentDir = path.dirname(currentFilePath)
const workspaceRoot = path.resolve(currentDir, '../..')
const distPath = path.join(workspaceRoot, 'dist')

if (existsSync(distPath)) {
  app.use(express.static(distPath))

  app.use((request, response, next) => {
    if (request.path.startsWith('/api')) {
      response.status(404).json({ error: 'API route not found.' })
      return
    }

    response.sendFile(path.join(distPath, 'index.html'))
  })
}

app.use((
  error: unknown,
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction,
) => {
  const normalizedError =
    error instanceof Error ? error : new Error('Unknown server error.')

  let status = 500

  if ('status' in normalizedError && typeof normalizedError.status === 'number') {
    status = normalizedError.status
  }

  if (error instanceof z.ZodError) {
    status = 400
  }

  const prismaErrorCode =
    error &&
    typeof error === 'object' &&
    'code' in error &&
    typeof error.code === 'string'
      ? error.code
      : null

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    prismaErrorCode === 'P2025'
  ) {
    status = 404
  }

  console.error(normalizedError)
  response.status(status).json({ error: normalizedError.message })
})

app.listen(port, () => {
  console.log(`CV builder API listening on http://localhost:${port}`)
})

async function renderPdf(html: string) {
  const executablePath = [
    process.env.PLAYWRIGHT_CHROME_PATH,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].find((candidate) => typeof candidate === 'string' && existsSync(candidate))

  const browser = await chromium.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle' })
    return await page.pdf({
      preferCSSPageSize: true,
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })
  } finally {
    await browser.close()
  }
}

function buildDocumentHtml(
  title: string,
  styles: string,
  body: ReactElement,
  styleSettings: DocumentStyleSettings,
) {
  const pageSize = documentPageDimensions[styleSettings.pageSize]
  const gutterSplit = styleSettings.gutter / 2
  const topMargin = `${styleSettings.margins.top}in`
  const rightMargin = `${styleSettings.margins.right + gutterSplit}in`
  const bottomMargin = `${styleSettings.margins.bottom}in`
  const leftMargin = `${styleSettings.margins.left + gutterSplit}in`
  const fontStylesheet = getDocumentFontStylesheet(styleSettings.fontFamily)

  return `<!DOCTYPE html>${renderToStaticMarkup(
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        {fontStylesheet ? (
          <link rel="stylesheet" href={fontStylesheet} />
        ) : null}
        <style>{`
          body {
            margin: 0;
            background: #ffffff;
          }

          html,
          body {
            width: auto;
            overflow: visible;
          }

          body.pdf-render .classic-cv-page,
          body.pdf-render .classic-cover-letter {
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            overflow: visible !important;
          }

          @page {
            size: ${pageSize.width}in ${pageSize.height}in;
            margin: ${topMargin} ${rightMargin} ${bottomMargin} ${leftMargin};
          }

          ${styles}
        `}</style>
      </head>
      <body className="pdf-render">{body}</body>
    </html>,
  )}`
}

function normalizeResumeTags(tags: unknown) {
  if (!Array.isArray(tags)) {
    return []
  }

  return [...new Set(tags.map((tag) => String(tag).trim()).filter(Boolean))]
}

function serializeResume(resume: {
  id: string
  title: string
  templateKey: string
  tags?: unknown
  data: unknown
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: resume.id,
    title: resume.title,
    templateKey: resume.templateKey,
    tags: normalizeResumeTags(resume.tags),
    data: normalizeResumeData(resumeDataSchema.parse(resume.data)),
    createdAt: resume.createdAt.toISOString(),
    updatedAt: resume.updatedAt.toISOString(),
  }
}

function serializeCoverLetter(coverLetter: {
  id: string
  title: string
  tags?: unknown
  linkedResumeId: string | null
  data: unknown
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: coverLetter.id,
    title: coverLetter.title,
    tags: normalizeResumeTags(coverLetter.tags),
    linkedResumeId: coverLetter.linkedResumeId,
    data: normalizeCoverLetterData(coverLetterDataSchema.parse(coverLetter.data)),
    createdAt: coverLetter.createdAt.toISOString(),
    updatedAt: coverLetter.updatedAt.toISOString(),
  }
}

function createNotFound(message: string) {
  const error = new Error(message) as ErrorWithStatus
  error.status = 404
  return error
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})
