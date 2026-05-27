import { Info } from 'lucide-react';

interface InfoNoteProps {
  text: string;
}

export default function InfoNote({ text }: InfoNoteProps) {
  return (
    <div className="info-note">
      <Info size={16} />
      <span>{text}</span>
    </div>
  );
}
