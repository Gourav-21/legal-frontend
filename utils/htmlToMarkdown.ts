import TurndownService from 'turndown';
// @ts-ignore - No types available for turndown-plugin-gfm
import { gfm } from 'turndown-plugin-gfm';

// Create a configured Turndown service for converting HTML to Markdown
const turndownService = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  fence: '```',
  emDelimiter: '_',
  strongDelimiter: '**',
  linkStyle: 'inlined',
  linkReferenceStyle: 'full'
});

// Use GitHub Flavored Markdown plugin for better table support
turndownService.use(gfm);

/**
 * Convert HTML content to Markdown
 * @param html - HTML string to convert
 * @returns Markdown string
 */
export function convertHtmlToMarkdown(html: string): string {
  try {
    return turndownService.turndown(html);
  } catch (error) {
    console.error('Error converting HTML to Markdown:', error);
    return html; // Return original HTML if conversion fails
  }
}

/**
 * Convert HTML tables specifically to Markdown tables
 * @param html - HTML string containing tables
 * @returns Markdown string with converted tables
 */
export function convertHtmlTablesToMarkdown(html: string): string {
  try {
    // First, let's handle HTML tables specifically
    const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    
    return html.replace(tableRegex, (match) => {
      return convertHtmlToMarkdown(match);
    });
  } catch (error) {
    console.error('Error converting HTML tables to Markdown:', error);
    return html;
  }
}

/**
 * Detect if content contains HTML tables
 * @param content - Content to check
 * @returns boolean indicating if HTML tables are present
 */
export function hasHtmlTables(content: string): boolean {
  const tableRegex = /<table[^>]*>[\s\S]*?<\/table>/i;
  return tableRegex.test(content);
}