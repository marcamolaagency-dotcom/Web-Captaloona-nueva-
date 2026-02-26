-- ============================================
-- Eliminar obra de Claudio con imagen local
-- ============================================
-- Ejecuta esto en Supabase SQL Editor
-- Elimina cualquier obra de Claudio Fiorentini
-- cuya imagen apunte a la carpeta /images/ local
-- (no son URLs externas sino archivos locales del proyecto)
-- ============================================

DELETE FROM artworks
WHERE artist_id = 'claudio-fiorentini'
  AND image_url LIKE '/images/%';

-- Verificar qué quedó:
SELECT id, title, image_url, status
FROM artworks
WHERE artist_id = 'claudio-fiorentini'
ORDER BY created_at DESC;
