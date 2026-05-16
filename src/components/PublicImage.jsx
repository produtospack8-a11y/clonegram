import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const EXT_ORDER = ['webp', 'jpg', 'jpeg', 'png', 'jfif'];

function extVariants(ext) {
  const u = ext.toUpperCase();
  return ext === u ? [ext] : [ext, u];
}

function stripExtension(name) {
  return name.replace(/\.(webp|jpg|jpeg|png|jfif)$/i, '');
}

function fileNameVariants(clean) {
  const v = new Set([clean]);
  const first = clean.charAt(0);
  if (/[a-z]/.test(first)) {
    v.add(first.toUpperCase() + clean.slice(1));
  }
  return [...v];
}

/**
 * Lista de URLs em `public/` (respeita `base` do Vite).
 * Ordem: webp → jpg → jpeg → png (formatos mais leves primeiro).
 */
export function publicImageCandidates(...names) {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
  const flat = names.flat().filter(Boolean);
  const seen = new Set();
  const out = [];

  for (const raw of flat) {
    const clean = stripExtension(String(raw).replace(/^\//, ''));
    if (!clean) continue;
    for (const variant of fileNameVariants(clean)) {
      for (const ext of EXT_ORDER) {
        for (const extTry of extVariants(ext)) {
          const url = `${base}${encodeURIComponent(variant)}.${extTry}`;
          if (!seen.has(url)) {
            seen.add(url);
            out.push(url);
          }
        }
      }
    }
  }
  return out;
}

/**
 * Imagem em `public/` com fallback automático de extensão e capitalização.
 * Atributos padrão aliviam trabalho do browser (lazy, async decode).
 */
export default function PublicImage({
  names,
  alt = '',
  style,
  className,
  loading = 'lazy',
  fetchPriority,
  decoding = 'async',
  width,
  height,
  sizes,
  draggable = false,
  onLoad,
  ...rest
}) {
  const key = Array.isArray(names) ? names.join('|') : String(names);
  const candidates = useMemo(
    () => publicImageCandidates(...(Array.isArray(names) ? names : [names])),
    [key]
  );
  const [i, setI] = useState(0);
  const exhaustedRef = useRef(false);
  const last = Math.max(0, candidates.length - 1);
  const src = candidates.length ? candidates[Math.min(i, last)] : '';

  useEffect(() => {
    setI(0);
    exhaustedRef.current = false;
  }, [candidates]);

  const handleError = useCallback(() => {
    if (exhaustedRef.current) return;
    setI((prev) => {
      if (prev >= last) {
        exhaustedRef.current = true;
        return prev;
      }
      return prev + 1;
    });
  }, [last]);

  if (!candidates.length) return null;

  return (
    <img
      src={src}
      alt={alt}
      style={style}
      className={className}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      width={width}
      height={height}
      sizes={sizes}
      draggable={draggable}
      onError={handleError}
      onLoad={onLoad}
      {...rest}
    />
  );
}
