/**
 * Automatic Product Photo Editor — brightness/contrast, white balance,
 * sharpness, shadow optimization, rotation/crop, and center alignment.
 *
 * In production this would call an image-processing pipeline (sharp,
 * a cloud function, or an AI image API). Here we return a descriptive
 * transform plan the mobile client's ImageEditor can apply/preview,
 * and Cloudinary can execute via named transformations.
 */
function buildEnhancementTransform({ background = 'AI Recommended' } = {}) {
  const backgroundMap = {
    Original: [],
    White: ['e_background_removal', 'b_white'],
    Beige: ['e_background_removal', 'b_rgb:D9C7A3'],
    Studio: ['e_background_removal', 'b_rgb:F2F2F2'],
    Transparent: ['e_background_removal'],
    'AI Recommended': ['e_background_removal', 'b_auto'],
  };

  return {
    cloudinaryTransformations: [
      'e_improve',
      'e_auto_brightness',
      'e_auto_contrast',
      'e_auto_color',
      'e_sharpen:60',
      ...(backgroundMap[background] || backgroundMap['AI Recommended']),
      'c_pad,g_center,ar_1:1',
    ],
    appliedBackground: background,
  };
}

module.exports = { buildEnhancementTransform };
