import fs from 'fs/promises';
import path from 'path';

import {
  DEFAULT_DPI,
  IMAGE_FORMAT,
} from './constants.js';

import {
  createTempDirectory,
  removeTempDirectory,
} from './temp-directory.js';

import { runPoppler } from './poppler.js';

export const renderPdfPages = async ({
  buffer,
  dpi = DEFAULT_DPI,
}) => {
  const tempDirectory =
    await createTempDirectory();

  const inputPdf = path.join(
    tempDirectory,
    'document.pdf'
  );

  const outputPrefix = path.join(
    tempDirectory,
    'page'
  );

  try {
    // ---------------------------------
    // Write uploaded PDF
    // ---------------------------------

    await fs.writeFile(inputPdf, buffer);

    // ---------------------------------
    // Render PDF -> PNG
    // ---------------------------------

    await runPoppler([
      '-png',
      '-r',
      String(dpi),
      inputPdf,
      outputPrefix,
    ]);

    // ---------------------------------
    // Read generated images
    // ---------------------------------

    const files = await fs.readdir(
      tempDirectory
    );

    const imageFiles = files
      .filter(file =>
        file.endsWith(`.${IMAGE_FORMAT}`)
      )
      .sort((a, b) => {
        const pageA = Number(
          a.match(/\d+/)?.[0] ?? 0
        );

        const pageB = Number(
          b.match(/\d+/)?.[0] ?? 0
        );

        return pageA - pageB;
      });

    const pages = await Promise.all(
      imageFiles.map(async (
        filename,
        index
      ) => ({
        pageNumber: index + 1,
        buffer: await fs.readFile(
          path.join(
            tempDirectory,
            filename
          )
        ),
      }))
    );

    return pages;
  } finally {
    await removeTempDirectory(
      tempDirectory
    );
  }
};