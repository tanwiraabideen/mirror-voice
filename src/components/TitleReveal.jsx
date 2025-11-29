import { TextReveal } from '@/components/ui/text-reveal';

export default function TitleReveal({ className, text }) {
    return (
        <div className="flex items-center justify-center">
            <TextReveal variant="fade" className={` ${className} font-bold text-foreground`}>
                {text}
            </TextReveal>
        </div>
    );
}
