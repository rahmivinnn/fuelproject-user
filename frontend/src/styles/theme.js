export const theme = {
  colors: {
    // Primary colors
    primary: '#1A1A1A',        // Black
    accent: '#00FF00',         // Green
    secondary: '#FFFFFF',      // White
    
    // Background colors
    background: '#FFFFFF',     // White background (light mode)
    backgroundDark: '#1A1A1A', // Dark background
    backgroundSecondary: '#2C2C2C', // Dark gray for cards
    
    // Text colors
    text: '#1A1A1A',           // Black text
    textLight: '#FFFFFF',      // White text (for dark backgrounds)
    textSecondary: '#CCCCCC',  // Light gray text
    textAccent: '#00FF00',     // Green text
    
    // Status colors
    success: '#00FF00',        // Green
    error: '#FF4444',          // Red
    warning: '#FFA500',        // Orange
    info: '#007AFF',           // Blue
    
    // Border colors
    border: '#333333',         // Dark border for dark theme
    borderDark: '#555555',     // Lighter dark border
    borderLight: '#E0E0E0',    // Light border for light theme
    
    // Shadow colors
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',
    shadowLight: 'rgba(0, 0, 0, 0.1)',
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
    
    // Card colors
    cardBackground: '#2C2C2C',
    cardBackgroundLight: '#F8F9FA',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  
  // Mapbox theme for dark mode
  mapbox: {
    style: {
      version: 8,
      sources: {
        'mapbox-streets': {
          type: 'vector',
          url: 'mapbox://mapbox.mapbox-streets-v8'
        }
      },
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: {
            'background-color': '#1A1A1A'
          }
        },
        {
          id: 'water',
          type: 'fill',
          source: 'mapbox-streets',
          'source-layer': 'water',
          paint: {
            'fill-color': '#2C2C2C'
          }
        },
        {
          id: 'landuse',
          type: 'fill',
          source: 'mapbox-streets',
          'source-layer': 'landuse',
          paint: {
            'fill-color': '#333333'
          }
        },
        {
          id: 'roads',
          type: 'line',
          source: 'mapbox-streets',
          'source-layer': 'road',
          paint: {
            'line-color': '#555555',
            'line-width': 1
          }
        },
        {
          id: 'labels',
          type: 'symbol',
          source: 'mapbox-streets',
          'source-layer': 'place_label',
          layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Regular'],
            'text-size': 12
          },
          paint: {
            'text-color': '#FFFFFF'
          }
        }
      ]
    }
  }
};

export default theme;
