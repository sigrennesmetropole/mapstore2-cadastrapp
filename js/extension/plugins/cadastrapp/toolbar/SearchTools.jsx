import React from 'react';
import { SEARCH_TOOLS } from '../../../constants';
import { toggleSearchTool } from '../../../actions/cadastrapp';
import { currentSearchToolSelector, getAuthLevel } from '../../../selectors/cadastrapp';

import TButton from './TButton';
import { connect } from 'react-redux';
import { Tooltip } from "react-bootstrap";
import Message from "@mapstore/components/I18N/Message";

/*
["zoom-to", "search-plots", "Plots Search"],
["search", "search-owners", "Owners Search"],
["user", "coownership", "Co-ownership data Search"],

 */
const tooltip = (id, msgId) => <Tooltip id={"id"}><Message msgId={msgId}/></Tooltip>;
const BUTTONS_SETTINGS = {
    [SEARCH_TOOLS.PLOT]: {
        glyph: "search",
        tooltip: tooltip("search", "cadastrapp.parcelle.tooltip")
    },
    [SEARCH_TOOLS.OWNER]: {
        glyph: "user",
        tooltip: tooltip("user", "cadastrapp.proprietaire.tooltip")
    },
    [SEARCH_TOOLS.COOWNER]: {
        glyph: "1-group",
        tooltip: tooltip("group", "cadastrapp.coProprietaire.tooltip")
    }
};

/*
["zoom-to", "search-plots", "Plots Search"],
["search", "search-owners", "Owners Search"],
["user", "coownership", "Co-ownership data Search"],
*/
/**
 * Implements Search tools buttons.
 * They are mutually exclusive and allow to select the needed search form.
 */
function SearchTools({ authLevel = {}, currentTool, onClick = () => { } }) {
    const { isCNIL1, isCNIL2 } = authLevel;

    return <>
        {
            Object.keys(SEARCH_TOOLS)
                .filter(k => {
                    if (isCNIL1 || isCNIL2) {
                        return true;
                    }
                    return [SEARCH_TOOLS.PLOT].includes(k); // allowed for normal users.
                })
                .map(k => SEARCH_TOOLS[k])
                .map(toolName => {
                    const isActive = toolName === currentTool;
                    return (<TButton
                        bsStyle={isActive && "active"}
                        {...BUTTONS_SETTINGS[toolName]}
                        onClick={() => isActive ? onClick() : onClick(toolName)}
                    />);
                })
        }
    </>;
}
export default connect(
    (state) => ({
        currentTool: currentSearchToolSelector(state),
        authLevel: getAuthLevel(state)

    }),
    {
        onClick: toggleSearchTool
    }
)(SearchTools);
