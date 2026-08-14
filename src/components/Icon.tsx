import {
  Grid3x3, LayoutGrid, Shapes, FlaskConical, Palette, Zap,
  Code, BarChart3, Brain, PenTool, DollarSign, Megaphone,
  Briefcase, Gamepad, Target, Brush, Database, Server,
  Globe, Layout, Search, FileText, Lightbulb, Map, FolderKanban,
  Trophy, Compass, Flag, Rocket, Eye, Sigma, TrendingUp,
  Calculator, Microscope, PenLine, Layers, Monitor, Star,
  MousePointer, Settings, Box, Table, Network,
  Sparkles, ChevronRight, ChevronLeft, Check, X, Clock,
  Lock, Play, Award, Flame, BookOpen,
  ArrowRight, ArrowLeft, Home, User, LogOut, Menu,
  type LucideProps,
} from 'lucide-react';
import type { ComponentType } from 'react';

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  Grid3x3, LayoutGrid, Shapes, FlaskConical, Palette, Zap,
  Code, BarChart3, Brain, PenTool, DollarSign, Megaphone,
  Briefcase, Gamepad, Target, Brush, Database, Server,
  Globe, Layout, Search, FileText, Lightbulb, Map, FolderKanban,
  Trophy, Compass, Flag, Rocket, Eye, Sigma, TrendingUp,
  Calculator, Microscope, PenLine, Layers, Monitor, Star,
  MousePointer, Settings, Box, Table, Network,
  Sparkles, ChevronRight, ChevronLeft, Check, X, Clock,
  Lock, Play, Award, Flame, BookOpen,
  ArrowRight, ArrowLeft, Home, User, LogOut, Menu,
};

interface IconProps extends LucideProps {
  name: string;
}

export function Icon({ name, ...props }: IconProps) {
  const Cmp = ICON_MAP[name] ?? Sparkles;
  return <Cmp {...props} />;
}
