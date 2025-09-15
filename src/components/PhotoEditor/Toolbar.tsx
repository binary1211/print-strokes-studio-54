import React from 'react';
import { 
  Frame, 
  Palette, 
  Sliders, 
  Type, 
  Sticker, 
  Layers,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  activeTab: string;
  onTabChange: (tab: 'frames' | 'filters' | 'adjust' | 'text' | 'textDesigns' | 'stickers' | 'layers') => void;
}

const toolbarItems = [
  { id: 'frames', icon: Frame, label: 'Frames' },
  { id: 'filters', icon: Palette, label: 'Filters' },
  { id: 'adjust', icon: Sliders, label: 'Adjust' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'textDesigns', icon: Sparkles, label: 'Text Designs' },
  { id: 'stickers', icon: Sticker, label: 'Stickers' },
  { id: 'layers', icon: Layers, label: 'Layers' },
] as const;

const Toolbar = ({ activeTab, onTabChange }: ToolbarProps) => {
  return (
    <div className="flex flex-col p-2 gap-2">
      {toolbarItems.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          variant={activeTab === id ? "default" : "ghost"}
          size="icon"
          onClick={() => onTabChange(id)}
          className={cn(
            "w-16 h-16 flex flex-col gap-1 relative group",
            activeTab === id && "bg-printStrokes-secondary hover:bg-printStrokes-secondary/90"
          )}
          title={label}
        >
          <Icon className="h-6 w-6" />
          <span className="text-xs font-medium">{label}</span>
          
          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-card border rounded shadow-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
            {label}
          </div>
        </Button>
      ))}
    </div>
  );
};

export default Toolbar;