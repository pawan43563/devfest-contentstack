import React from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  className = "",
}) => {
  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
    >
      {src ? (
        <img className="aspect-square h-full w-full" src={src} alt={alt} />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted">
          {fallback ? (
            <span className="text-sm font-medium uppercase">{fallback}</span>
          ) : (
            <span className="text-sm font-medium uppercase">?</span>
          )}
        </div>
      )}
    </div>
  );
};
