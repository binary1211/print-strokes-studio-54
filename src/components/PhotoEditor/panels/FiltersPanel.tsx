import React from 'react';
import { useEditorStore } from '@/stores/editorStore';
import { cn } from '@/lib/utils';

const filterOptions = [
  { id: 'none', name: 'Original', description: 'No filter applied' },
  { id: 'grayscale', name: 'Grayscale', description: 'Classic black & white' },
  { id: 'sepia', name: 'Sepia', description: 'Warm vintage tone' },
  { id: 'vintage', name: 'Vintage', description: 'Retro film look' },
  { id: 'vivid', name: 'Vivid', description: 'Enhanced colors' },
  { id: 'cool', name: 'Cool', description: 'Blue-tinted cool tone' },
  { id: 'warm', name: 'Warm', description: 'Orange-tinted warm tone' },
  { id: 'dramatic', name: 'Dramatic', description: 'High contrast' }
];

const FiltersPanel = () => {
  const { filters, applyFilterPreset, updateFilters } = useEditorStore();

  const applyFilter = (filterId: string) => {
    switch (filterId) {
      case 'grayscale':
        updateFilters({ 
          brightness: 0, 
          contrast: 10, 
          saturation: -100, 
          filterName: 'grayscale' 
        });
        break;
      case 'sepia':
        updateFilters({ 
          brightness: 10, 
          contrast: 5, 
          saturation: -30, 
          filterName: 'sepia' 
        });
        break;
      default:
        applyFilterPreset(filterId);
        break;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h4 className="font-semibold mb-3">Photo Filters</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Apply creative filters to enhance your photo's mood and style.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {filterOptions.map((filter) => (
          <button
            key={filter.id}
            onClick={() => applyFilter(filter.id)}
            className={cn(
              "group p-4 text-left border-2 rounded-xl transition-all duration-200",
              "hover:border-printStrokes-primary hover:shadow-md hover:scale-[1.02]",
              "focus:outline-none focus:ring-2 focus:ring-printStrokes-primary focus:ring-offset-2",
              filters.filterName === filter.id
                ? "border-printStrokes-secondary bg-printStrokes-secondary/5"
                : "border-border bg-card"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium group-hover:text-printStrokes-primary transition-colors">
                  {filter.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {filter.description}
                </div>
              </div>
              
              {/* Filter Preview */}
              <div className="w-12 h-12 rounded-lg overflow-hidden border bg-gradient-to-br from-pink-500 to-blue-500 relative">
                <div 
                  className="absolute inset-0"
                  style={{
                    filter: filter.id === 'grayscale' 
                      ? 'grayscale(100%)' 
                      : filter.id === 'sepia'
                      ? 'sepia(100%)'
                      : filter.id === 'vintage'
                      ? 'sepia(50%) contrast(115%) brightness(110%)'
                      : filter.id === 'vivid'
                      ? 'saturate(150%) contrast(120%)'
                      : filter.id === 'cool'
                      ? 'hue-rotate(240deg) saturate(120%)'
                      : filter.id === 'warm'
                      ? 'hue-rotate(25deg) saturate(120%)'
                      : filter.id === 'dramatic'
                      ? 'contrast(140%) brightness(90%)'
                      : 'none'
                  }}
                />
              </div>
            </div>

            {/* Selection Indicator */}
            {filters.filterName === filter.id && (
              <div className="mt-2 w-full h-1 bg-printStrokes-secondary rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
        <strong>✨ Creative Tip:</strong> Combine filters with manual adjustments in the Adjust panel for unique looks. Vintage works great for family photos, while Vivid enhances landscapes.
      </div>
    </div>
  );
};

export default FiltersPanel;