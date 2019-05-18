import React from "react";

const Item = props => {
  return (
    <li>
      <dl>
        <dt>
          <img src={props.thumbnail} alt={props.thumbnail} />
        </dt>
        <dd>
          <h3 dangerouslySetInnerHTML={{ __html: props.title }} />
          <p>{props.blogname}</p>
          <article dangerouslySetInnerHTML={{ __html: props.contents }} />
          <a href={props.url} target="_blank">
            링크 바로가기
          </a>
        </dd>
      </dl>
    </li>
  );
};

export default Item;
