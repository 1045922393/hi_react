import { useState, useEffect } from "react";
import "./index.less";
import BackBtn from "@/components/back";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Configuration, OpenAIApi } from "openai";
import md5 from "md5";
import Button, * as ButtonCustom from "./components/buttonComp";
import {
  TextField,
  Card,
  CardContent,
  CardActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";

const BDFY = {
  APPID: "20230317001604070",
  API: "https://fanyi-api.baidu.com/api/trans/vip/translate",
  KEY: "bcb3RxXcGVmEsP8KVN_7",
  TYPEAPI: "https://fanyi-api.baidu.com/api/trans/vip/language",
};

// 翻译文本的类型判断
async function languageIdentify(q = "") {
  const salt = (Math.random() * 10 ** 9) | 0;
  const sign = md5(BDFY.APPID + q + salt + BDFY.KEY);
  const { data } = await axios({
    url: BDFY.TYPEAPI,
    method: "get",
    params: {
      q,
      appid: BDFY.APPID,
      salt,
      sign,
    },
  });
  if (data.error_code) {
    return data.error_msg;
  }
  return data.data.src;
}

// 翻译文本
async function transformer(q = "", isEn2Zh = true) {
  const salt = (Math.random() * 10 ** 9) | 0;
  // 签名生成 appid+q+salt+密钥
  const sign = md5(BDFY.APPID + q + salt + BDFY.KEY);
  const { data } = await axios({
    url: BDFY.API,
    method: "get",
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // },
    params: {
      q: q,
      from: "auto",
      to: isEn2Zh ? "zh" : "en",
      salt,
      appid: BDFY.APPID,
      sign,
    },
  });
  if (data.error_code) {
    return data.error_msg;
  }
  return data.trans_result[0].dst;
}
// 英To中
function en2zh(q) {
  return transformer(q);
}
// 中To英
function zh2en(q) {
  return transformer(q, false);
}

// 自动识别翻译类型, 转为中/英
async function autoTransform(q = "") {
  const type = await languageIdentify(q);
  return transformer(q, type !== "zh");
}

// 组件
function OpenAi() {
  let openai = null;
  // 上下文谈话
  let [chatContent, setChatContent] = useState("");
  function initOpenai() {
    const OPENAI_API_KEY =
      "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";
    const configuration = new Configuration({
      organization: "org-kPyJllacGAY6Q3KKa4k6NgHf",
      apiKey: OPENAI_API_KEY,
    });
    openai = new OpenAIApi(configuration);
    return openai;
  }

  useEffect(() => {
    openai = initOpenai();
  }, []);

  async function completions(openai, p) {
    const preText = {
      question:
        'I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with "Unknown".\n',
      chat: "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n",
    };
    const copRes = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: preText.chat + "\n" + p,
      temperature: 0.9,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.6,
    });
    return copRes;
  }

  async function createImage(openai, p) {
    const imgRes = await openai.createImage({
      prompt: p,
      n: 1,
      size: "1024x1024",
    });
    const image_url = imgRes.data.data[0].url;
    return image_url;
  }

  const preWord = {
    Chat: "Hi, who are you?",
    Image: "A cute baby sea otter",
  };

  const [AiType, setAiType] = useState("Image");
  const [generalImgSrc, setGeneralImgSrc] = useState("");

  const handleAiTypeChange = (e, v) => {
    setAiType(v);
    setChatContent(""); // 清空谈话内容
    setGeneralImgSrc(""); // 清空谈话内容
  };

  const [textInput, setTextInput] = useState("Hi, who are you?");

  useEffect(() => {
    setTextInput(preWord[AiType]);
  }, [AiType]);

  const handleChangeTextInput = (event) => {
    setTextInput(event.target.value);
  };

  // 整合谈话内容
  const contactChat = (p) => {
    if (typeof p === "string") {
      chatContent = chatContent + p;
    } else if (Array.isArray(p)) {
      chatContent = chatContent + "\n" + p.join("\n");
    }
    chatContent = chatContent.replace(/[\n]+/g, "\n");
    setChatContent(chatContent);
  };

  const handleClickSubmit = () => {
    switch (AiType) {
      case "Chat":
        handleClickSubmitC();
        break;
      case "Image":
        handleClickSubmitI();
        break;
      default:
        break;
    }
  };

  // Chat submit
  const handleClickSubmitC = async () => {
    if (!openai) openai = initOpenai();
    chatContent = (chatContent ? chatContent + "\n" : "") + textInput;
    // const transformText = await autoTransform(textInput);
    const resp = await completions(openai, chatContent);
    const enChartResponse = resp.data.choices[0].text;
    // const transformResult = await autoTransform(enChartResponse);
    contactChat(enChartResponse);
    setTextInput("");
  };

  // Image submit
  const handleClickSubmitI = async () => {
    if (!openai) openai = initOpenai();
    const type = await languageIdentify(textInput);
    let transformText = textInput;
    if(type === 'zh') {
       transformText = await autoTransform(textInput);
    }
    const imgUrl = await createImage(openai, transformText);
    setGeneralImgSrc(imgUrl);
  };

  const handleClearChat = () => {
    setTextInput("");
    setChatContent("");
    setGeneralImgSrc("");
  };

  return (
    <div className="openAi_page">
      <BackBtn style={{ color: "#000" }}></BackBtn>
      <div className="form_type">
        <FormControl>
          <FormLabel id="demo-row-radio-buttons-group-label">AI Type</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={AiType}
            onChange={handleAiTypeChange}
          >
            <FormControlLabel value="Chat" control={<Radio />} label="Chat" />
            <FormControlLabel value="Image" control={<Radio />} label="Image" />
          </RadioGroup>
        </FormControl>
      </div>
      {chatContent &&
        chatContent.split("\n").map((item, index) => {
          if (!item) return <></>;
          if (index % 2 === 0) {
            return (
              <Card
                key={index}
                variant="outlined"
                sx={{ width: "420px", margin: "10px auto" }}
              >
                <CardContent>
                  <TextField
                    sx={{ width: "100%" }}
                    id="human_input_field"
                    label="Human:"
                    multiline
                    rows={4}
                    disabled={true}
                    variant="standard"
                    value={item}
                  />
                </CardContent>
              </Card>
            );
          } else {
            return (
              <Card
                key={index}
                variant="outlined"
                sx={{ width: "420px", margin: "10px auto" }}
              >
                <CardContent>
                  <TextField
                    sx={{ width: "100%" }}
                    id="ai_input_field"
                    label="AI:"
                    multiline
                    rows={4}
                    variant="standard"
                    value={item}
                    disabled={true}
                  />
                </CardContent>
              </Card>
            );
          }
        })}
      <Card variant="outlined" sx={{ width: "420px", margin: "10px auto" }}>
        <CardContent>
          <TextField
            sx={{ width: "100%" }}
            id="human_input_field"
            label="Human:"
            multiline
            rows={4}
            variant="standard"
            value={textInput}
            onChange={handleChangeTextInput}
          />
        </CardContent>
        <CardActions>
          <ButtonCustom.DangerButton
            sx={{ marginRight: "10px" }}
            variant="contained"
            onClick={handleClearChat}
          >
            Clear
          </ButtonCustom.DangerButton>
          <Button onClick={handleClickSubmit}>Submit</Button>
        </CardActions>
      </Card>

      {/* Image Show */}
      {generalImgSrc && (
        <Card variant="outlined" sx={{ width: "420px", margin: "10px auto" }}>
          <CardContent>
            <img src={generalImgSrc} style={{ maxWidth: "100%" }}></img>
          </CardContent>
        </Card>
      )}
      <div></div>
    </div>
  );
}

export default OpenAi;
