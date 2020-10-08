import React, { PureComponent } from 'react';
import {
  Button,
  Divider,
  Grid,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react';
import { createDiaryPost, deleteDiaryPost, getDiaryPosts, patchDiaryPost } from '../api/diary-api';


export default class DiaryPosts extends PureComponent {

  state = {
    diaryPosts: [],
    newDiaryTitle: '',
    newDiaryBody: '',
    loadingDiaryPosts: true
  }

  handleTitleChange = e => {
    this.setState({ newDiaryTitle: e.target.value });
  }

  handleBodyChange = e => {
    this.setState({ newDiaryBody: e.target.value });
  }

  onEditButtonClick = diaryPostId => {
    History.push(`/diary/${diaryPostId}/edit`);
  }

  onDiaryPostDelete = async diaryPostId => {
    try {
      await deleteDiaryPost(this.props.getIdToken(), diaryPostId);
      this.setState({ diaryPosts: this.state.diaryPosts.filter(diaryPost => diaryPost.diaryPostId !== diaryPostId)});
    } catch {
      alert('Diary Post deletion failed')
    }
  }

  onDiaryPostCreate = async e => {
    try {
      const newDiaryPost = await createDiaryPost(this.props.getIdToken(), {
        title: this.state.newDiaryTitle,
        body: this.state.newDiaryBody
      });

      this.setState({
        diaryPosts: [...this.state.diaryPosts, newDiaryPost],
        newDiaryTitle: '',
        newDiaryBody: ''
      });
    } catch {
      alert("Diary post creation failed");
    }
  }

  async componentDidMount() {
    try {
      const diaryPosts = await getDiaryPosts(this.props.getIdToken());
      this.setState({
        diaryPosts,
        loadingDiaryPosts: false
      })
    } catch (e) {
      alert(`Failed to fetch diary posts: ${e.message}`)
    }
  }

  renderCreateDiaryPostInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Diary Title',
            }}
            fluid
            actionPosition="left"
            placeholder="Dear diary..."
            onChange={this.handleTitleChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Diary Title',
              onClick: this.onDiaryPostCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Insert body here..."
            onChange={this.handleBodyChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderDiaryPosts() {
    if (this.state.loadingDiaryPosts) {
      return this.renderLoading()
    }

    return this.renderDiaryPostsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Diary Posts...
        </Loader>
      </Grid.Row>
    )
  }

  renderDiaryPostsList() {
    return (
      <Grid padded>
        {this.state.diaryPosts.map((diaryPost, pos) => {
          return (
            <Grid.Row key={diaryPost.diaryPostId}>
              <Grid.Column width={10} verticalAlign="middle">
                {diaryPost.title}
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {diaryPost.body}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(diaryPost.diaryPostId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onDiaryPostDelete(diaryPost.diaryPostId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {diaryPost.attachmentUrl && (
                <Image src={diaryPost.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

}
