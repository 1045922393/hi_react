import "@/pages/picture.css";
import { getPic } from "@/api/getPic";
import React from "react";
import { useGetParams,withRouter } from "@/utils/params";
/**
 * desc: 自动换图片
 * 双击可以换图片
 */

class Pic extends React.Component {
  constructor() {
    super();
    this.state = {
      picList: [],
      curImg: {},
      imgIndex: (Math.random() * 1000) | 0,
      loading: true,
    };
    this.timeId = null;
  }
  async freshImgList() {
    let res = window.pictureConfig.data;
    this.setState({
      picList: res,
      curImg: res[0],
    });
    const [searchParams] = this.props.router.search;
    const p = searchParams.get('p');
    res = await getPic(p || undefined);
    this.setState({
      picList: res,
      curImg: res[0],
    });
  }

  nextImg() {
    this.setState({
      imgIndex: this.state.imgIndex + 1,
    });
  }

  loadedImg() {
    this.setState({
      loading: false,
    });
  }
  loadingImg() {
    this.setState({
      loading: true,
    });
  }

  async componentDidMount() {
    this.freshImgList();
  }
  imgError = () => {
    this.loadingImg();
    this.nextImg();
  };
  imgLoad = () => {
    this.loadedImg();
    this.timeId = setTimeout(() => {
      clearTimeout(this.timeId);
      this.nextImg();
    }, 25000);
  };
  imgClick = () => {
    clearTimeout(this.timeId);
    this.imgError();
  };
  render() {
    const { imgIndex, picList, loading } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          {picList.length !== 0 ? (
            <img
              className={loading ? "img_hide" : ""}
              src={picList[imgIndex % picList.length].path}
              onError={this.imgError.bind(this)}
              onLoad={this.imgLoad}
              onDoubleClick={this.imgClick}
              alt="lose it"
            />
          ) : (
            "isLoading"
          )}
          {loading ? (
            <>
              <div className="loading"></div>
              <div className="loading"></div>
            </>
          ) : (
            ""
          )}
        </header>
      </div>
    );
  }
}

export default withRouter(Pic);
