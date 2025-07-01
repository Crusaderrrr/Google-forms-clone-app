import React from 'react';
import { TagCloud } from 'react-tagcloud';


const TagsCloud = ({ tags, onTagClick }) => (
  <TagCloud
    minSize={12}
    maxSize={35}
    tags={tags}
    onClick={onTagClick}
    style={{ cursor: 'pointer'}}
  />
);

export default TagsCloud;