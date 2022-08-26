export default function ModalScript(props) {
  const data = props.data;
  return `
localStorage.setItem("run-function", true);

  setTimeout(runPopup, 3000);

  if (window.location.href.indexOf("/success/") > -1) {
    function runPopup() {
      if (localStorage.getItem("run-function") === "true") {
        localStorage.setItem("run-function", false);
        function addCss(href) {
          var s = document.createElement("link");
          s.setAttribute("rel", "stylesheet");
          s.setAttribute("href", href);
          document.head.appendChild(s);
          addCss = function () {};
        }

        addCss("${process.env.NEXTAUTH_URL}/api/nuvemshop/storeCSS");

        function addPopUp() {
          var modal = document.createElement("div");
          var modalWrap = document.createElement("div");
          var close = document.createElement("div");
          var closex = document.createElement("a");
          var trees = document.createElement("div");
          var treesDesc = document.createElement("a");
          var treesDesc2 = document.createElement("p");
          var treesValue = document.createElement("a");
          var mainText = document.createElement("a");
          var submainText = document.createElement("a");
          var button = document.createElement("button");
          var partnerDiv = document.createElement("div");
          var partnerText = document.createElement("a");
          var img = document.createElement("img");
          

          modal.setAttribute("id", "modal-coclima");
          modalWrap.setAttribute("id", "modalWrap-coclima");
          close.setAttribute("id", "close-coclima");
          closex.setAttribute("id", "closex-coclima");
          trees.setAttribute("id", "trees-coclima");
          treesDesc.setAttribute("id", "treesDesc-coclima");
          treesDesc2.setAttribute("id", "treesDesc2-coclima");
          treesValue.setAttribute("id", "treesValue-coclima");
          mainText.setAttribute("id", "mainText-coclima");
          submainText.setAttribute("id", "submainText-coclima");
          button.setAttribute("id", "button-coclima");
          partnerDiv.setAttribute("id", "logo-partner-div");
          partnerText.setAttribute("id", "partner-text");
          img.setAttribute("id", "logo-img");

          treesDesc.appendChild(
            document.createTextNode("Esta loja já contribuiu com o plantio de")
          );
          /*   treesValue.appendChild(document.createTextNode('1000')); */
          treesDesc2.appendChild(document.createTextNode(" ${data.trees} ${data.word}!"));

          mainText.appendChild(
            document.createTextNode("Sua compra ajuda a transformar o mundo")
          );
          submainText.appendChild(
            document.createTextNode(
              "A cada compra realizada você ajuda a plantar árvores e construir um planeta melhor"
            )
          );

          closex.appendChild(document.createTextNode("X"));

          close.appendChild(closex);

          trees.appendChild(treesDesc);
          button.setAttribute('onclick', "window.open('https://coclima.com', '_blank');");

          trees.appendChild(treesValue);
          treesDesc.appendChild(treesDesc2);

          button.appendChild(document.createTextNode("Conhecer mais"));

          partnerText.appendChild(document.createTextNode("em parceria com:"));
          img.setAttribute("src", "data:image/png;base64, ${data.logo}");

          partnerDiv.appendChild(partnerText);
          partnerDiv.appendChild(img);

          modal.appendChild(close);
          modal.appendChild(trees);
          modal.appendChild(mainText);
          modal.appendChild(submainText);
          modal.appendChild(button);
          modal.appendChild(partnerDiv);
          modalWrap.appendChild(modal);
          document.body.appendChild(modalWrap);

          close.onclick = function closeModal() {
            modalWrap.style.display = "none";
          };

          addCss = function () {
            close.onclick = function closeModal() {
              modalWrap.style.display = "none";
            };
          };
        }

        addPopUp();
      }
    }
  }

`;
}
