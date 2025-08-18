import TurndownService from 'turndown';
// @ts-ignore - No types available for turndown-plugin-gfm
import { gfm } from 'turndown-plugin-gfm';
import * as cheerio from 'cheerio';

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
  console.log("its runnig")
  try {
    let cleaned = html;
    // Use cheerio to parse HTML and find all tables
    const $ = cheerio.load(cleaned);
    $('table').each(function () {
      const table = $(this);
      let markdown = '';
      const rows: string[][] = [];
      table.find('tr').each(function () {
        const row: string[] = [];
        $(this).find('th, td').each(function () {
          let cell = $(this).html() || '';
          // Replace <br> tags with comma and space
          cell = cell.replace(/<br\s*\/?>/gi, ', ');
          // Remove any remaining HTML tags inside cell
          cell = cheerio.load('<div>' + cell + '</div>')('div').text().replace(/\s+/g, ' ').trim();
          row.push(cell);
        });
        rows.push(row);
      });
      // Build Markdown table
      if (rows.length > 0) {
        // Header row
        markdown += '| ' + rows[0].join(' | ') + ' |\n';
        markdown += '| ' + rows[0].map(() => '---').join(' | ') + ' |\n';
        // Data rows
        for (let i = 1; i < rows.length; i++) {
          markdown += '| ' + rows[i].join(' | ') + ' |\n';
        }
      }
      // Replace the table HTML with Markdown
      table.replaceWith('\n' + markdown + '\n');
    });
    // Return the updated HTML with tables replaced by Markdown
    return $.root().text();
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
  // Check for table opening tag (even if not properly closed)
  const hasTableTag = /<table[^>]*>/i.test(content);

  // Check for table-related elements that indicate table structure
  const hasTableElements = /<t[hdr][^>]*>/i.test(content); // th, td, tr tags

  // Check for both conditions to be more confident it's a table
  return hasTableTag || hasTableElements;
}