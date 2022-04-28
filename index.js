import { html, o } from "https://cdn.skypack.dev/sinuous?dts";

const config = {
  embedURI: `//access.bree.workers.dev/cdn/${encodeURIComponent("https://jan.revolt.chat/embed?url=")}`,
};

const cls = (obj) =>
  Object.entries(obj)
    .filter(([_, v]) => v)
    .map(([k, _]) => k);

/** @param {string} url */
const fetchEmbed = (url) =>
  fetch(`${config.embedURI}${encodeURIComponent(url)}`);

/** @param {{ embed: EnumSelect<Embed, "Image"> }} embed */
const ImageEmbed = ({ embed }) =>
  html`
    <article class="embed card">
      <img
        src=${embed.url}
        width=${embed.width}
        height=${embed.height}
        class=${[embed.height > embed.width && "tall"]}
      />
    </article>
  `;

const Cond = (props, children) => {
  const { cond = () => true } = props ?? {};
  console.log(cond.toString(), cond());
  if (cond()) {
    return children();
  } else {
    return new DocumentFragment();
  }
};

/** @param {{ embed: EnumSelect<Embed, "Website"> }} params */
const BasicEmbed = ({ embed }) =>
  html`
    <article class="embed card" style=${{ "--color": embed.color }}>
      ${embed.image && html`<img
          src=${embed.image.url}
          width=${embed.image.width}
          height=${embed.image.height}
          class=${[(embed.image != null && embed.image.height > embed.image.width) && "tall"]}
      />`}
      <div class="elide site_name" hidden=${!embed.site_name}>${embed.site_name}</div>
      <div class="elide title" hidden=${!embed.title}>${embed.title}</div>
      <p class="description">${embed.description}</p>
    </article>
  `;

/** @param {{ embed: Embed }} embed */
const Embed = ({ embed }) => {
  console.log(embed);
  switch (embed.type) {
    case "Image":
      return ImageEmbed({ embed });
    case "Website":
      return BasicEmbed({ embed });
    default:
      return html`None`;
  }
};

const empty = {
  type: "Website",
  url: "https://safebooru.org/index.php?page=post&s=view&json=1&id=3298613",
  special: {
    type: "None",
  },
  title: "3298613",
  description:
    "👍0  \n2girls, absurdres, animal_ears, aquablue1992, bag, basketball, black_skirt, brand_new_animal, brown_hair, building, copyright_name, english_text, highres, hiwatashi_nazuna, holding, holding_bag, holdi",
  image: {
    url:
      "https://safebooru.org/images/3171/dc2ed660e8a6f75d02c346e30626f35e11affb0d.jpg",
    width: 5543,
    height: 3920,
    size: "Large",
  },
  opengraph_type: "website",
  color: "#978308",
};

const embed = o(empty);
const loading = o(true);

/** @param {string} url The url to fetch */
async function updateEmbed(url) {
  loading(true);
  const res = await fetchEmbed(url);

  if (res.ok) {
    /** @type {Embed} */
    const data = await res.json();
    console.log(data);
    embed(data);
    loading(false);
  } else {
    console.error(await res.text());
  }
}

document.body.append(html`
  <form
    class="form"
    onsubmit=${(e) => {
    e.preventDefault();
    updateEmbed(e.target.elements.url.value);
    return false;
  }}
  >
    <input
      type="url"
      name="url"
      pattern="https://.*"
      value="https://embeds.bree.dev/get/kagemori_michiru"
      required
    />
    <div class="loading">
      <div hidden=${() => !loading()}>loading...</div>
    </div>
  </form>
  ${() => Embed({ embed: embed() })}
`);

window.onload = () => loading(false);
