
-- Drop existing overly permissive storage policies
DROP POLICY IF EXISTS "Authenticated users can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update property images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete property images" ON storage.objects;

-- Recreate with ownership checks using auth.uid() folder prefix
CREATE POLICY "Users upload to own folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users update own files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'property-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users delete own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
