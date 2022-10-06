import React from 'react'
import { Box, Card, useTheme } from '@mui/material'
import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import MuiPopper from '@mui/material/Popper'

const Popper = styled(MuiPopper, {
  shouldForwardProp: (prop) =>
    prop !== 'popperWidth' &&
    prop !== 'arrowWidth' &&
    prop !== 'arrowHeight' &&
    prop !== 'extraArrowLength',
})(({ popperWidth, arrowWidth, arrowHeight, extraArrowLength }) => ({
  zIndex: 2,
  '& .popper-anim': {
    transition: 'transform 150ms ease-out',
  },
  '& .arrow-base': {
    position: 'absolute',
    content: '""',
    display: 'block',
    borderStyle: 'solid',
    borderRadius: '4px',
    borderColor: 'inherit',
    backgroundColor: 'inherit',
    visibility: 'visible',
  },
  '& .arrow-top': {
    borderWidth: '1px 0px 0px 1px',
    borderRadius: '4px',
    height: arrowHeight / 2,
    width: arrowWidth,
  },
  '& .arrow-bottom': {
    borderWidth: '0px 0px 1px 1px',
    borderRadius: '4px',
    height: arrowHeight / 2,
    width: arrowWidth,
  },
  '& .arrow-side': {
    borderWidth: '1px 1px 1px 0px',
    borderRadius: '0px 4px 4px 0px',
    height: arrowHeight - 1,
    width: arrowWidth + extraArrowLength,
  },
  '&[data-popper-placement*="right"]': {
    '& .arrow-top': {
      top: `calc(50% - ${arrowHeight / 2}px)`,
      left: -(arrowWidth / 2 + extraArrowLength),
      transform: 'skew(-45deg)',
    },
    '& .arrow-bottom': {
      top: 'calc(50% - 1px)',
      transform: 'skew(45deg)',
      left: -(arrowWidth / 2 + extraArrowLength),
    },
    '& .arrow-side': {
      top: `calc(50% - ${arrowHeight / 2}px)`,
      left: -extraArrowLength,
    },
  },
  '&[data-popper-placement*="left"]': {
    '& .arrow-top': {
      alignSelf: 'flex-end',
      top: 'calc(50% - 1px)',
      transform: 'skew(-45deg) rotate(180deg)',
      right: -(arrowWidth / 2 + extraArrowLength) - popperWidth,
    },
    '& .arrow-bottom': {
      top: `calc(50% - ${arrowHeight / 2}px)`,
      transform: 'skew(45deg) rotate(180deg)',
      right: -(arrowWidth / 2 + extraArrowLength) - popperWidth,
    },
    '& .arrow-side': {
      top: `calc(50% - ${arrowHeight / 2}px)`,
      transform: 'rotate(180deg)',
      right: -extraArrowLength - popperWidth,
    },
  },
}))

/**
 * Popper with Arrow pointing to element.
 * To use:
 * 1. Create Hooks for open, anchor, animate, content
 * 2. Write functions to set open, anchor when Popper should be visible
 * 3. Write function to set content of Popper.
 * 4. Add Delay to 2. to set animate, for smoother transitions
 * @param open Boolean, determines DetailsPopper visibility
 * @param anchor Reference, element DetailsPopper points to, Popper is invisible when null
 * @param animate Boolean, determines if DetailsPopper is animated. Set this after ~250ms
 * @param content Any, content that's displayed inside the DetailsPopper
 * @param popperWidth Number, width of DetailsPopper
 * @param arrowHeight Number, height of Arrow pointing to anchor
 * @param arrowWidth Number, width of Arrow pointing to anchor
 * @param extraArrowLength Number, additional length of Arrow pointing to anchor
 */
export default function DetailsPopper({
  open,
  anchor,
  content,
  popperWidth,
  arrowHeight,
  arrowWidth,
  extraArrowLength,
}) {
  const canBeOpen = open && Boolean(anchor)
  const id = canBeOpen ? 'transition-popper' : undefined
  const [arrowRef, setArrowRef] = React.useState()
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0)
  const [animate, setAnimate] = React.useState(false)
  const [timeoutID, setTimeoutID] = React.useState(-1)

  const theme = useTheme()
  function handleClick() {
    forceUpdate()
  }

  React.useEffect(() => {
    setAnimate(false)
    clearTimeout(timeoutID)
    if (open) {
      setTimeoutID(
        setTimeout(() => {
          setAnimate(true)
        }, 150)
      )
    }
  }, [open, anchor, content])

  return (
    <>
      <Popper
        id={id}
        open={canBeOpen}
        anchorEl={anchor}
        placement="right"
        className={animate ? 'popper-anim' : 'popper'}
        popperWidth={popperWidth}
        arrowWidth={arrowWidth}
        arrowHeight={arrowHeight}
        extraArrowLength={extraArrowLength}
        modifiers={[
          {
            name: 'arrow',
            enabled: true,
            options: {
              element: arrowRef,
            },
          },
          {
            name: 'offset',
            enabled: true,
            options: {
              offset: [0, 20],
            },
          },
          {
            name: 'computeStyles',
            options: {
              adaptive: false,
            },
          },
          {
            name: 'flip',
            enabled: true,
          },
          {
            name: 'preventOverflow',
            options: {
              padding: 80,
            },
          },
        ]}
      >
        <div>
          <Card
            sx={{
              border: 1,
              p: 1,
              backgroundColor: 'background.paper',
              borderColor: theme.palette.primary.main,
              borderRadius: 1,
              maxWidth: popperWidth,
              width: popperWidth,
              zIndex: 2,
            }}
            onClick={() => {
              setTimeout(() => {
                handleClick()
              }, 125)
            }}
            onTransitionEnd={() => {
              handleClick()
            }}
          >
            {content}
          </Card>
          <Box
            ref={setArrowRef}
            sx={{
              zIndex: -1,
              backgroundColor: 'background.paper',
              borderColor: theme.palette.primary.main,
              visibility: 'hidden',
            }}
            className={animate ? 'popper-anim' : 'popper'}
          >
            <Box className="arrow-base arrow-top" />
            <Box className="arrow-base arrow-bottom" />
            <Box className="arrow-base arrow-side" />
          </Box>
        </div>
      </Popper>
      <style>{`
        .popper-anim {
          transition: transform 150ms ease-out;
        }
      `}</style>
    </>
  )
}

DetailsPopper.propTypes = {
  anchor: PropTypes.object,
  open: PropTypes.bool.isRequired,
  content: PropTypes.any,
  popperWidth: PropTypes.number,
  arrowWidth: PropTypes.number,
  arrowHeight: PropTypes.number,
  extraArrowLength: PropTypes.number,
}

DetailsPopper.defaultProps = {
  popperWidth: 250,
  arrowWidth: 32,
  arrowHeight: 32,
  extraArrowLength: 0,
}
