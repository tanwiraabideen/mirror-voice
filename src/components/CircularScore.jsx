import { useState, useEffect, useRef } from 'react';

export default function CircularScore({ score = 0, size = 120, strokeWidth = 8 }) {
    const [displayScore, setDisplayScore] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const componentRef = useRef(null);

    // Clamp score between 0 and 10
    const clampedScore = Math.max(0, Math.min(10, score));

    // Calculate circle properties
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (displayScore / 10) * circumference;

    // Calculate font sizes based on size prop
    const scoreFontSize = size * 0.25; // 25% of circle size
    const labelFontSize = size * 0.12; // 12% of circle size

    // Intersection Observer to trigger animation on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.5 }
        );

        if (componentRef.current) {
            observer.observe(componentRef.current);
        }

        return () => {
            if (componentRef.current) {
                observer.unobserve(componentRef.current);
            }
        };
    }, []);

    // Animate the score counting up
    useEffect(() => {
        if (!isVisible) return;

        let startTime = null;
        const duration = 2000; // 2 seconds for smoother animation

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for ultra-smooth animation (ease-out-cubic)
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentScore = easeOutCubic * clampedScore;

            setDisplayScore(currentScore);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setDisplayScore(clampedScore);
            }
        };

        requestAnimationFrame(animate);
    }, [isVisible, clampedScore]);

    // Determine color based on score
    const getColor = (score) => {
        if (score >= 8) return '#10b981'; // green
        if (score >= 6) return '#3b82f6'; // blue
        if (score >= 4) return '#f59e0b'; // orange
        return '#ef4444'; // red
    };

    const color = getColor(displayScore);

    return (
        <div ref={componentRef} className="inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                />

                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                    style={{
                        transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s ease'
                    }}
                />
            </svg>

            {/* Score text in the center */}
            <div className="absolute flex flex-col items-center justify-center">
                <span className="font-bold" style={{ color, fontSize: `${scoreFontSize}px` }}>
                    {displayScore.toFixed(1)}
                </span>
                <span className="text-gray-500" style={{ fontSize: `${labelFontSize}px` }}>
                    / 10
                </span>
            </div>
        </div>
    );
}