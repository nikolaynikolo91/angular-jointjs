import * as AdaptiveCards from 'adaptivecards';

export const acHostConfig = new AdaptiveCards.HostConfig({ // not used for now test.shape
  fontFamily: 'Segoe UI, Helvetica Neue, sans-serif',
  containerStyles: {
      default: {
          backgroundColor: '#FFFFFF',
          foregroundColors: {
              default: {
                  default: '#333333',
                  subtle: '#484644',
              },
              accent: {
                  default: '#2E89FC',
                  subtle: '#0078D4'
              },
              attention: {
                  default: '#D13438',
                  subtle: '#A4262C'
              },
              dark: {
                  default: '#000000',
                  subtle: '#646464'
              },
              good: {
                  default: '#0B6A0B',
                  subtle: '#028A02'
              },
              light: {
                  default: '#FFFFFF',
                  subtle: '#E6E6E6'
              },
              warning: {
                  default: '#B75C00',
                  subtle: '#986F0B'
              }
          }
      },
      emphasis: {
          backgroundColor: '#F2F2F2',
          foregroundColors: {
              default: {
                  default: '#000000',
                  subtle: '#484644'
              }
          }
      },
      accent: {
          backgroundColor: '#C7DEF9',
          foregroundColors: {
              default: {
                  default: '#333333',
                  subtle: '#484644'
              }
          }
      },
      good: {
          backgroundColor: '#CCFFCC',
          foregroundColors: {
              default: {
                  default: '#333333',
                  subtle: '#484644'
              }
          }
      },
      attention: {
          backgroundColor: '#FFC5B2',
          foregroundColors: {
              default: {
                  default: '#333333',
                  subtle: '#484644'
              }
          }
      },
      warning: {
          backgroundColor: '#FFE2B2',
          foregroundColors: {
              default: {
                  default: '#333333',
                  subtle: '#484644'
              }
          }
      }
  },
  supportsInteractivity: true,
  imageSizes: {
      small: 40,
      medium: 80,
      large: 160
  },
  actions: {
      actionAlignment: 'stretch',
      actionsOrientation: 'vertical',
      buttonSpacing: 8,
      maxActions: 100,
      showCard: {
          actionMode: 'inline',
          inlineTopMargin: 8
      },
      spacing: 'default'
  },
  adaptiveCard: {
      allowCustomStyle: false
  },
  imageSet: {
      imageSize: 'medium',
      maxImageHeight: 100
  },
  factSet: {
      title: {
          color: 'default',
          size: 'default',
          isSubtle: false,
          weight: 'bolder',
          wrap: true,
          maxWidth: 150
      },
      value: {
          color: 'default',
          size: 'default',
          isSubtle: false,
          weight: 'default',
          wrap: true
      },
      spacing: 8
  },
  textBlock: {
      headingLevel: 1
  }
});