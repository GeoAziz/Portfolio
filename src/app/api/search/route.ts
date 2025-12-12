import { NextRequest, NextResponse } from 'next/server';
import { searchContent, getAllContentTags, getTagStats, getSearchSuggestions } from '@/lib/content-search';

/**
 * GET /api/search?q=query&type=blog&tags=tag1,tag2
 * Search across all content with advanced filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') as 'blog' | 'research' | 'project' | undefined;
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    const suggestions = searchParams.get('suggestions') === 'true';

    // Return search suggestions if requested
    if (suggestions) {
      const suggestionsList = getSearchSuggestions(query, 10);
      return NextResponse.json({
        success: true,
        data: suggestionsList,
        count: suggestionsList.length,
      });
    }

    // Return tag stats if requested
    if (searchParams.get('tags') === 'stats') {
      const stats = getTagStats();
      return NextResponse.json({
        success: true,
        data: stats,
      });
    }

    // Return all tags if requested
    if (searchParams.get('tags') === 'all') {
      const allTags = getAllContentTags();
      return NextResponse.json({
        success: true,
        data: allTags,
      });
    }

    // Perform search
    const results = searchContent({
      query,
      type,
      tags,
      featured,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
      query,
      filters: {
        type,
        tags,
        featured,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
