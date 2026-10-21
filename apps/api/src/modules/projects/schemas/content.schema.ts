import { z } from 'zod';

/**
 * Project content validation schema
 * 
 * Konva-independent: no Konva class names or internal fields
 * Validates element types, structure, and enforces 2MB limit
 */

const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const SizeSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
});

const StyleSchema = z.object({
  fill: z.string().optional(),
  stroke: z.string().optional(),
  strokeWidth: z.number().optional(),
  opacity: z.number().min(0).max(1).optional(),
  fontSize: z.number().optional(),
  fontFamily: z.string().optional(),
  fontWeight: z.string().optional(),
  fontStyle: z.string().optional(),
  textAlign: z.enum(['left', 'center', 'right']).optional(),
  textDecoration: z.string().optional(),
}).passthrough(); // Allow additional style properties

const BaseElementSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'image', 'shape', 'group']),
  position: PositionSchema,
  size: SizeSchema,
  rotation: z.number().optional().default(0),
  zIndex: z.number().int().optional().default(0),
  style: StyleSchema.optional(),
});

const TextElementSchema = BaseElementSchema.extend({
  type: z.literal('text'),
  content: z.string(),
});

const ImageElementSchema = BaseElementSchema.extend({
  type: z.literal('image'),
  src: z.string().url(),
  alt: z.string().optional(),
});

const ShapeElementSchema = BaseElementSchema.extend({
  type: z.literal('shape'),
  shapeType: z.enum(['rectangle', 'circle', 'ellipse', 'line', 'polygon']),
  points: z.array(z.number()).optional(), // For polygon/line
});

const GroupElementSchema = BaseElementSchema.extend({
  type: z.literal('group'),
  children: z.array(z.lazy(() => ElementSchema)),
});

const ElementSchema: z.ZodType<any> = z.discriminatedUnion('type', [
  TextElementSchema,
  ImageElementSchema,
  ShapeElementSchema,
  GroupElementSchema,
]);

const PageSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  elements: z.array(ElementSchema),
});

const CanvasSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  background: z.string().optional(),
});

export const ProjectContentSchema = z.object({
  schemaVersion: z.number().int().positive(),
  canvas: CanvasSchema,
  pages: z.array(PageSchema).min(1), // At least one page required
});

export type ProjectContent = z.infer<typeof ProjectContentSchema>;
export type Element = z.infer<typeof ElementSchema>;
export type Page = z.infer<typeof PageSchema>;

/**
 * Validate project content
 * - Validates schema structure
 * - Enforces 2MB size limit
 * - Rejects unknown element types
 */
export function validateProjectContent(content: unknown): { 
  success: boolean; 
  data?: ProjectContent; 
  error?: string 
} {
  // Check size limit (2MB)
  try {
    const jsonString = JSON.stringify(content);
    const sizeInBytes = Buffer.byteLength(jsonString, 'utf8');
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

    if (sizeInBytes > maxSizeInBytes) {
      return {
        success: false,
        error: `Content size ${(sizeInBytes / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of 2MB`,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Content exceeds maximum allowed size of 2MB',
    };
  }

  // Validate schema
  const result = ProjectContentSchema.safeParse(content);
  
  if (!result.success) {
    return {
      success: false,
      error: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; '),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

/**
 * Create blank project content
 */
export function createBlankContent(): ProjectContent {
  return {
    schemaVersion: 1,
    canvas: {
      width: 1920,
      height: 1080,
      background: '#ffffff',
    },
    pages: [
      {
        id: 'page-1',
        name: 'Page 1',
        elements: [],
      },
    ],
  };
}
