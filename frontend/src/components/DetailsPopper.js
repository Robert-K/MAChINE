import React from 'react'
import { Box, Popper } from '@mui/material'
import PropTypes from 'prop-types'

function DetailsPopper(props) {
  const canBeOpen = props.open && Boolean(props.anchor)
  const id = canBeOpen ? 'transition-popper' : undefined
  const [arrowRef, setArrowRef] = React.useState()
  return (
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
      ]}
    >
      <div>
        <Box
          sx={{
            border: 1,
            p: 1,
            backgroundColor: 'background.paper',
            borderColor: '#c42525',
            borderRadius: 1,
            zIndex: 2,
          }}
        >
          {props.content}
        </Box>

        <Box ref={setArrowRef} sx={{ zIndex: -1 }}>
          <PopperArrow width={32} height={32} length={0}></PopperArrow>
        </Box>
      </div>
    </Popper>
  )
}

function PopperArrow(props) {
  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          borderTop: 1,
          borderLeft: 1,
          backgroundColor: 'white',
          content: '""',
          display: 'block',
          top: 'calc(50% - ' + props.height / 2 + 'px)',
          transform: 'skew(-45deg)',
          borderRadius: 1,
          borderColor: '#c42525',
          height: props.height / 2,
          left: -(props.width / 2 + props.length),
          width: props.width,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          borderBottom: 1,
          borderLeft: 1,
          backgroundColor: 'white',
          content: '""',
          display: 'block',
          top: 'calc(50% - 1px)',
          transform: 'skew(45deg)',
          borderRadius: 1,
          borderColor: '#c42525',
          height: props.height / 2,
          left: -(props.width / 2 + props.length),
          width: props.width,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          borderRight: 1,
          borderBottom: 1,
          borderTop: 1,
          backgroundColor: 'white',
          content: '""',
          display: 'block',
          top: 'calc(50% - ' + props.height / 2 + 'px)',
          borderRadius: 1,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderColor: '#c42525',
          height: props.height - 2,
          left: -props.length,
          width: props.width + props.length,
        }}
      ></Box>
    </>
  )
}

DetailsPopper.propTypes = {
  anchor: PropTypes.object,
  open: PropTypes.bool.isRequired,
  content: PropTypes.any.isRequired,
  parentOpener: PropTypes.func.isRequired,
}
PopperArrow.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
}

export default DetailsPopper
