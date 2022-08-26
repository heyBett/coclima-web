export default function ModalCSS() {
  return `
  #modal-coclima {
  width: 424px;
  height: 480px;
    left: 50vw;
    top: 50vh;
    transform: translate(-50%, -50%);
  margin: auto;
  z-index: 9999;

  background: #FFFFFF;
  box-shadow: 0px 4px 20px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  position: fixed;
}
#modalWrap-coclima {
      width: 100vw;
    height: 100vh;
    display: block;
    position: fixed;
    top: 0;
    z-index: 9999;
    background: #000000c4;
}

#close-coclima {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 44px;
  height: 44px;
  left: 367px;
  top: 12px;
  border-radius: 100px;
  background-color: #F1F3F4;
  cursor: pointer;
}

#closex-coclima {
  font-size: 28px;
  color: #3E4054;
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
}

#trees-coclima {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 12px 16px;

  position: absolute;
  width: 239.81px;
  height: 53px;
     left: 49px;
  top: 50px;

  

  box-sizing: border-box;
  border-radius: 8px;
}

#treesDesc-coclima {
  position: static;
  width: 267px;
  height: 57px;
  left: 79px;
  top: 12px;

  font-family: Inter;
  font-style: normal;
  font-weight: normal;
font-size: 13px;
    line-height: 16px;
   align-items: center;
  text-align: center;

  color: #3F3F3F;

  flex: none;
  order: 2;
  flex-grow: 0;
  margin: 0px 9px;
}
#treesDesc2-coclima {
  font-size: 1.5rem;
    margin-top: 1rem;
    font-weight: bold;
 color: #0EC164;
}

#treesValue-coclima {
  position: static;
  width: 60px;
  height: 29px;
  left: 163.81px;
  top: 12px;

  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 29px;

  display: flex;
  align-items: center;
  text-align: center;

  color: #0EC164;

  flex: none;
  order: 3;
  flex-grow: 0;
  margin: 0px 9px;
}

.green {
  color: #0EC164,
}

#mainText-coclima {
  position: absolute;
  width: 327px;
  height: 78px;
  left: 49px;
  top: 135px;

  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 39px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.02em;

  color: #000000;
}

#submainText-coclima {
  position: absolute;
  width: 267px;
  height: 57px;
  left: 79px;
  top: 235px;

  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  text-align: center;

  color: #3F3F3F;
}

#button-coclima {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 15px 29px;

  position: absolute;
  width: 195px;
  height: 47px;
  left: 121px;
  top: 318px;

  font-weight: bold;
  font-size: 14px;

  color: #FFFFFF;
  text-transform: uppercase;

  background: #0EC164;
  border-radius: 8px;
  border-width: 0px;
  cursor: pointer;
}

#partner-text {
  display: flex;
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 10px;
  line-height: 12px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-right: 15px;

  color: #808EA9;
}

#logo-img {
  display: flex;
  width: auto;

}

#logo-partner-div {
  position: absolute;
  top: 400px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
`;
}
