class CanvasEditor {
    constructor(canvasId, template) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.template = template;
      this.image = null;
  
      this.caption = template.caption.text;
      this.cta = template.cta.text;
      this.backgroundColor = '#0369A1';
  
      this.loadResources();
    }
  
    loadResources() {
      this.maskImage = new Image();
      this.maskImage.src = `${this.template.urls.mask}?random=${Math.random()}`;
      this.maskImage.onload = () => this.draw();
  
      this.maskStrokeImage = new Image();
      this.maskStrokeImage.src = `${this.template.urls.stroke}?random=${Math.random()}`;
      this.maskStrokeImage.onload = () => this.draw();
  
      this.designPatternImage = new Image();
      this.designPatternImage.src = `${this.template.urls.design_pattern}?random=${Math.random()}`;
      this.designPatternImage.onload = () => this.draw();
    }
  
    loadImage(imageSrc) {
      this.image = new Image();
      this.image.src = imageSrc;
      this.image.onload = () => this.draw();
    }
  
    setCaption(caption) {
      this.caption = caption;
      this.draw();
    }
  
    setCallToAction(cta) {
      this.cta = cta;
      this.draw();
    }
  
    setBackgroundColor(color) {
      this.backgroundColor = color;
      this.draw();
    }
  
    wrapText(text, x, y, maxWidth, lineHeight) {
      const words = text.split(' ');
      let line = '';
      for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + ' ';
        let metrics = this.ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && i > 0) {
          this.ctx.fillText(line, x, y);
          line = words[i] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      this.ctx.fillText(line, x, y);
    }
  
    draw() {
      const { ctx, canvas, template } = this;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Layer 1: Background Color
      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
  
      // Layer 2: Design Pattern
      if (this.designPatternImage) {
        ctx.drawImage(this.designPatternImage, 0, 0, canvas.width, canvas.height);
      }
  
      // Layer 3: Image Mask
      if (this.image) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(template.image_mask.x, template.image_mask.y, template.image_mask.width, template.image_mask.height);
        ctx.clip();
  
        const imgAspect = this.image.width / this.image.height;
        const maskAspect = template.image_mask.width / template.image_mask.height;
        let drawWidth, drawHeight, offsetX, offsetY;
  
        if (imgAspect > maskAspect) {
          drawHeight = template.image_mask.height;
          drawWidth = this.image.width * (drawHeight / this.image.height);
          offsetX = (template.image_mask.width - drawWidth) / 2;
          offsetY = 0;
        } else {
          drawWidth = template.image_mask.width;
          drawHeight = this.image.height * (drawWidth / this.image.width);
          offsetX = 0;
          offsetY = (template.image_mask.height - drawHeight) / 2;
        }
  
        ctx.drawImage(this.image, template.image_mask.x + offsetX, template.image_mask.y + offsetY, drawWidth, drawHeight);
        ctx.restore();
      }
  
      // Layer 4: Mask Stroke
      if (this.maskStrokeImage) {
        ctx.drawImage(this.maskStrokeImage, 0, 0, canvas.width, canvas.height);
      }
  
      // Layer 5: Texts
      ctx.fillStyle = template.caption.text_color;
      ctx.font = `${template.caption.font_size}px Arial`;
      this.wrapText(this.caption, template.caption.position.x, template.caption.position.y, template.caption.max_characters_per_line * template.caption.font_size / 2, template.caption.font_size);
  
      ctx.fillStyle = template.cta.background_color;
       // ctx.fillRect(template.cta.position.x - 10, template.cta.position.y - template.cta.font_size + 10, ctaWidth + 20, ctaHeight);
      ctx.fillRect(template.cta.position.x - 10, template.cta.position.y - template.cta.font_size, ctx.measureText(this.cta).width, template.cta.font_size + 20);
  
      ctx.fillStyle = template.cta.text_color;
      ctx.font = '30px Arial';
      ctx.fillText(this.cta, template.cta.position.x, template.cta.position.y);
    }
  }
  
  export default CanvasEditor;
  