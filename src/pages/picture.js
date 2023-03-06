import "@/pages/picture.css";
import { getPic } from "@/api/getPic";
import React from "react";
import { withRouter } from "@/utils/params";
import { downloadTxt } from "@/utils/download";
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
      isNsfw: false,
    };
    this.timeId = null;
  }
  async freshImgList() {
    let isNsfw = false;
    const [searchParams] = this.props.router.search;
    const p = searchParams.get("p");
    let res = window.pictureConfig.data;
    if (p && p.endsWith("1")) {
      this.setState({
        isNsfw: true,
      });
      isNsfw = true;
      res = window.pPictureConfig.data;
    }
    this.setState({
      picList: res,
    });
    res = await getPic(p || "100", {
      categories: isNsfw ? "001" : undefined,
    });
    let content = "export const imgsList = [";
    res.forEach((item) => {
      content = `${content}
      {path: "${item.path}"},`;
    });
    content += "]";
    downloadTxt(content, "p || '100'");
    this.setState({
      picList: res,
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
