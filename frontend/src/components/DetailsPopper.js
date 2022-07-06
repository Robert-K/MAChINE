import React from 'react'
import { Box, Popper, Card } from '@mui/material'
import PropTypes from 'prop-types'

function DetailsPopper(props) {
  const canBeOpen = props.open && Boolean(props.anchor)
  const id = canBeOpen ? 'transition-popper' : undefined
  const [arrowRef, setArrowRef] = React.useState()
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0)

  function handleClick() {
    forceUpdate()
  }

  return (
    <>
      <Popper
        id={id}
        open={canBeOpen}
        anchorEl={props.anchor}
        placement="right"
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
        className={props.waited ? 'popper-anim' : 'popper'}
        sx={{
          zIndex: 2,
        }}
      >
        <div>
          <Card
            sx={{
              border: 1,
              p: 1,
              backgroundColor: 'background.paper',
              borderColor: '#c42525',
              borderRadius: 1,
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
            {props.content}
          </Card>
          <Box
            ref={setArrowRef}
            sx={{
              zIndex: -1,
            }}
            className={props.waited ? 'popper-anim' : 'popper'}
          >
            <PopperArrow width={32} height={32} length={0}></PopperArrow>
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

function PopperArrow(props) {
  return (
    <>
      <Box
        sx={{
          borderTop: 1,
          borderLeft: 1,
          borderRadius: 1,
          top: `calc(50% - ${props.height / 2}px)`,
          transform: 'skew(-45deg)',
          height: props.height / 2,
          left: -(props.width / 2 + props.length),
          width: props.width,
        }}
        className="arrow-base"
      />
      <Box
        sx={{
          borderBottom: 1,
          borderLeft: 1,
          borderRadius: 1,
          top: 'calc(50% - 1px)',
          transform: 'skew(45deg)',
          height: props.height / 2,
          left: -(props.width / 2 + props.length),
          width: props.width,
        }}
        className="arrow-base"
      />
      <Box
        sx={{
          borderRight: 1,
          borderBottom: 1,
          borderTop: 1,
          borderRadius: 1,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          top: `calc(50% - ${props.height / 2}px)`,
          height: props.height - 2,
          left: -props.length,
          width: props.width + props.length,
        }}
        className="arrow-base"
      ></Box>
      <style>{`
        .arrow-base {
          position: absolute;
          background-color: white;
          content: "";
          display: block;
          border-color: #c42525;
        }
      `}</style>
    </>
  )
}

DetailsPopper.propTypes = {
  anchor: PropTypes.object,
  open: PropTypes.bool.isRequired,
  content: PropTypes.any.isRequired,
  waited: PropTypes.bool,
}
PopperArrow.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
}

export default DetailsPopper
