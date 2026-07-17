import sharp from 'sharp';

const DEFAULT_DENSITY = Number(process.env.OCR_IMAGE_DENSITY) || 300;

export const preprocessImage = async ({
  buffer,
  density = DEFAULT_DENSITY,
}) => {
  return sharp(buffer, {
    density,
  })
    .grayscale()
    .normalize()
    .sharpen()
    .png()
    .toBuffer();
};