import React from "react";

function TagsForm ({ tags, tagInput, handleAddTag, handleDeleteTag, setTagInput, readOnly }) {


    return (
        <div className="mb-3 text-start">
            <label className="form-label fw-bold me-2">Tags</label>
            <span className="text-muted me-auto">{'(Click to delete)'}</span>
            {!readOnly && (
                <div className="input-group mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tag name"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === "Enter" && tagInput.trim()) {
                                handleAddTag();
                            }
                        }}
                    />
                    <button
                        type="button"
                        className="btn btn-outline-success"
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                    >
                        Add
                    </button>
                </div>
            )}
            <div>
                {tags.length > 0 ? (
                    tags.map(tagObj => {
                        const tag = tagObj.tag || tagObj; 
                        return (
                        <span
                            className="badge bg-primary me-2"
                            key={tag.id || tag.name}
                            onClick={() => handleDeleteTag(tag.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            {tag.name}
                        </span>
                        );
                    })
                    ) : (
                    readOnly ? null : <span className="text-muted">No tags yet</span>
                )}
            </div>
      </div>
    )
};

export default TagsForm;