export default function FooterScript(props) {
  return (
    `
 let footer = document.getElementsByTagName("footer")[0];

  let logo = document.createElement("img");
  logo.src = ` +
    process.env.NEXTAUTH_URL +
    `"/api/nuvemshop/footerLogo";

  footer.after(logo);

  logo.style.cssText +=
    "margin: 1rem auto; display: block; width: 200px; background-color: #ffffff42; padding: 1rem; border-radius: 1rem";

`
  );
}
