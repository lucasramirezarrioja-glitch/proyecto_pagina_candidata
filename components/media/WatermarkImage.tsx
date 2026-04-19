import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type Props = Omit<ImageProps, "alt"> & {
  alt: string;
  overlayClassName?: string;
  /** Marca de agua #EsConE (overlay CSS). Por defecto desactivada. */
  watermark?: boolean;
  strong?: boolean;
  containerClassName?: string;
};

/**
 * Imagen optimizada; la marca de agua es opcional (`watermark`).
 */
export function WatermarkImage({
  alt,
  className,
  overlayClassName,
  watermark = false,
  strong = false,
  containerClassName,
  sizes = "(min-width: 1024px) 45vw, 100vw",
  ...imageProps
}: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        containerClassName,
      )}
    >
      <Image
        alt={alt}
        sizes={sizes}
        className={cn("h-full w-full object-cover", className)}
        {...imageProps}
      />
      {watermark ? (
        <div
          aria-hidden="true"
          className={cn(
            "watermark-overlay",
            strong && "watermark-overlay-strong",
            overlayClassName,
          )}
        />
      ) : null}
    </div>
  );
}
