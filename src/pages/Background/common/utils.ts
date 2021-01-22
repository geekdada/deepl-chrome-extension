export const cropImage = async (
  dataUrl: string,
  config: {
    x: number
    y: number
    width: number
    height: number
    imageWidth: number
    imageHeight: number
    imageRatio: number
  },
): Promise<string> => {
  const croppedCanvas = await new Promise<HTMLCanvasElement>(
    (resolve, reject) => {
      const canvas = document.createElement('canvas')
      const img = new Image()

      canvas.width = config.width
      canvas.height = config.height
      img.onload = () => {
        const ctx = canvas.getContext('2d')

        canvas.width = config.width
        canvas.height = config.height

        ctx?.drawImage(
          img,
          config.x * config.imageRatio,
          config.y * config.imageRatio,
          config.width * config.imageRatio,
          config.height * config.imageRatio,
          0,
          0,
          config.width,
          config.height,
        )

        resolve(canvas)
      }

      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }

      img.src = dataUrl
    },
  )

  return croppedCanvas.toDataURL('image/jpeg')
}
