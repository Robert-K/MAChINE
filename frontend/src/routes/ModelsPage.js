import React from 'react'
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material'
import Button from '@mui/material/Button'
import SelectionList from '../components/SelectionList'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import UserContext from '../UserContext'

/**
 * Depicts a list of saved models and shows a description of the selected model on click
 */
export default function ModelsPage() {
  const [selectedModel, setSelectedModel] = React.useState(-1)
  const [modelList, setModelList] = React.useState([])

  const user = React.useContext(UserContext)

  React.useEffect(() => {
    api.getModelList(user.userID).then((models) => setModelList(models))
  }, [user])

  const updateSelection = (model, index) => {
    setSelectedModel(index)
  }

  const navigate = useNavigate()

  return (
    <Box sx={{ m: 5 }}>
      <Grid container spacing={2}>
        <Grid item md={3}>
          {
            <SelectionList
              updateFunc={updateSelection}
              elements={modelList}
              elementType="model"
              usePopper={false}
              addFunc={() => navigate('/base-models')}
            ></SelectionList>
          }
        </Grid>
        <Grid item md={9}>
          {ModelDescription()}
        </Grid>
      </Grid>
    </Box>
  )

  function ModelDescription() {
    if (selectedModel < 0) {
      // no model selected
      return (
        <Card>
          <CardContent>
            <Typography align="center" color="lightgrey">
              Select a Model.
            </Typography>
          </CardContent>
        </Card>
      )
    } else {
      const currentModel = modelList[selectedModel]
      return (
        <Card>
          <CardContent>
            <CardHeader>{currentModel.name}</CardHeader>
            <Typography>Base Model: {currentModel.baseModel}</Typography>
            <Typography>Trained on: </Typography>
            {renderFittings(currentModel.fittings)}
          </CardContent>
          <CardActions>
            <Grid container justifyContent="center">
              <Button component={Link} to="/datasets">
                Select Training Data
              </Button>
            </Grid>
          </CardActions>
        </Card>
      )
    }
  }
}

function renderFittings(fittings) {
  return (
    <List>
      {fittings.map((fitting) => (
        <RenderFitting fitting={fitting} key={fitting.id}></RenderFitting>
      ))}
    </List>
  )
}

/**
 * renders a fitting into a collapsable list
 * @param props contains the fitting to be rendered
 * @returns {JSX.Element}
 */
function RenderFitting(props) {
  const [open, setOpen] = React.useState(false)
  const toggleOpen = () => {
    setOpen(!open)
  }
  const theme = useTheme()
  return (
    <ListItem key={props.fitting.id}>
      <Box sx={{ width: 1 }}>
        <ListItemButton onClick={() => toggleOpen()}>
          {open ? <ExpandLess /> : <ExpandMore />}
          <ListItemText
            primary={props.fitting.datasetID}
            sx={{ color: theme.palette.primary.main }}
          ></ListItemText>
        </ListItemButton>
        <Collapse
          in={open}
          timeout="auto"
          mountOnEnter
          unmountOnExit
          orientation="vertical"
        >
          <List sx={{ pl: 4 }}>
            <ListItem>
              <ListItemText
                sx={{ color: theme.palette.primary.main }}
                primary="Epochs: "
              ></ListItemText>
              {props.fitting.epochs}
            </ListItem>
            <ListItem>
              <ListItemText
                sx={{ color: theme.palette.primary.main }}
                primary="Batch Size: "
              ></ListItemText>
              {props.fitting.batchSize}
            </ListItem>
            <ListItem>
              <ListItemText
                sx={{ color: theme.palette.primary.main }}
                primary="Accuracy:"
              ></ListItemText>
              {props.fitting.accuracy}%
            </ListItem>
          </List>
        </Collapse>
        <Divider />
      </Box>
    </ListItem>
  )
}

RenderFitting.propTypes = {
  fitting: PropTypes.object.isRequired,
}
