import React, { useEffect, useRef, useState } from 'react';
import { Button, TextField, Container, Typography, Box, Fab } from '@mui/material';
import { ChromePicker } from 'react-color';
import CanvasEditor from './CanvasEditor';
import templateData from './templateData.json';
import './App.css';

const App = () => {
  const canvasRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [caption, setCaption] = useState(templateData.caption.text);
  const [cta, setCta] = useState(templateData.cta.text);
  const [bgColor, setBgColor] = useState('#0369A1');
  const [colorHistory, setColorHistory] = useState([]);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const editorInstance = new CanvasEditor('canvas', templateData);
      setEditor(editorInstance);
    }
  }, [canvasRef]);

  useEffect(() => {
    if (editor) {
      editor.setCaption(caption);
    }
  }, [caption, editor]);

  useEffect(() => {
    if (editor) {
      editor.setCallToAction(cta);
    }
  }, [cta, editor]);

  useEffect(() => {
    if (editor) {
      editor.setBackgroundColor(bgColor);
    }
  }, [bgColor, editor]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target.result;
        editor.loadImage(src);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (color) => {
    setBgColor(color.hex);
    if (!colorHistory.includes(color.hex)) {
      setColorHistory((prevHistory) => {
        const newHistory = [color.hex, ...prevHistory];
        return newHistory.length > 5 ? newHistory.slice(0, 5) : newHistory;
      });
    }
    setDisplayColorPicker(false); // Hide color picker after selecting a color
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box style={{marginTop:'20px'}}>
          <Typography variant="h5" gutterBottom align='center'>Canvas Editor for Zocket</Typography>
          <canvas id="canvas" ref={canvasRef} width="1080" height="1080" style={{ height: 600, width: 700, border: '1px solid #000' }}></canvas>
        </Box>
        <Box display="flex" flexDirection="column" width="400px" height="500px" marginTop="180px">
        <Typography variant="h6" gutterBottom align='center'>Add customization</Typography>
          <TextField
            label="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Call to Action"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Box display="flex" alignItems="center" marginY={2}>
            {colorHistory.map((color, index) => (
              <Box
                key={index}
                onClick={() => setBgColor(color)}
                style={{
                  backgroundColor: color,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  marginRight: 8,
                  cursor: 'pointer',
                }}
              />
            ))}
            <Typography >Colors </Typography>
            <Fab  size="small" color="secondary" aria-label="add" sx={{marginLeft:'20px'}} onClick={() => setDisplayColorPicker(!displayColorPicker)}>
              +
            </Fab>
          </Box>
          {displayColorPicker && (
            <Box position="absolute" zIndex={2}>
              <ChromePicker
                color={bgColor}
                onChangeComplete={handleColorChange}
              />
            </Box>
          )}
          <Button variant="contained" component="label">
            Upload Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default App;
