// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock used Kekule classes and functions as it does not load properly in a test environment
jest.mock('kekule', () => ({
  Kekule: {
    Editor: {
      Composer: jest.fn().mockImplementation(() => ({
        setPredefinedSetting: jest.fn().mockReturnThis(),
        setAllowCreateNewChild: jest.fn().mockReturnThis(),
        setCommonToolButtons: jest.fn().mockReturnThis(),
        setChemToolButtons: jest.fn().mockReturnThis(),
        getEditorConfigs: jest.fn().mockImplementation(() => ({
          structureConfigs: {
            defBondLength: 1,
          },
          hotKeyConfigs: {
            setHotKeys: jest.fn(),
          },
        })),
        getRenderConfigs: jest.fn().mockImplementation(() => ({
          colorConfigs: {
            useAtomSpecifiedColor: true,
          },
        })),
      })),
    },
    externalResourceManager: {
      register: jest.fn(),
    },
    ChemWidget: {
      Viewer: jest.fn().mockImplementation(() => ({
        setDrawDimension: jest.fn(),
        setRenderType: jest.fn(),
        setEnableToolbar: jest.fn(),
        setToolButtons: jest.fn().mockReturnThis(),
      })),
    },
    Render: {
      RendererType: {
        R3D: 'R3D',
      },
    },
  },
}))

jest.spyOn(global.console, 'warn').mockImplementationOnce((message) => {
  if (!message.includes('tsParticles pathseg polyfill')) {
    global.console.warn(message)
  }
})
