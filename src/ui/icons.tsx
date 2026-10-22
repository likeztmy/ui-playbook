import {
  ArrowLeft,
  Check,
  ChevronDown,
  Circle,
  Contrast,
  Copy,
  CopyPlus,
  Moon,
  MousePointer2,
  Pencil,
  PenLine,
  Plus,
  Search,
  Square,
  Sun,
  Trash2,
  Type,
  X,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';

// Lucide at Precision's icon spec: 16px, a true 1.5px stroke at that size,
// inheriting the text colour. Decorative unless given a label.
function precision(Icon: LucideIcon) {
  return (props: LucideProps) => <Icon size={16} strokeWidth={1.5} nonScalingStroke aria-hidden {...props} />;
}

export const PointerIcon = precision(MousePointer2);
export const RectIcon = precision(Square);
export const EllipseIcon = precision(Circle);
export const TextIcon = precision(Type);
export const PenIcon = precision(PenLine);
export const PlusIcon = precision(Plus);
export const CopyIcon = precision(Copy);
export const DuplicateIcon = precision(CopyPlus);
export const RenameIcon = precision(Pencil);
export const TrashIcon = precision(Trash2);
export const ChevronDownIcon = precision(ChevronDown);
export const ContrastIcon = precision(Contrast);
export const SunIcon = precision(Sun);
export const MoonIcon = precision(Moon);
export const SearchIcon = precision(Search);
export const BackIcon = precision(ArrowLeft);
export const CheckIcon = precision(Check);
export const CrossIcon = precision(X);
