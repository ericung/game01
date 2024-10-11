import React from 'react';

export default class Interface extends React.Component {
    render() {
        return (
            <>
                <div id="menuleftcontent">
                    <form>
                        <b>User</b>
                        <input id="user" value="@Model.User" disabled/>
                        <br/>
                        <b>Network</b>
                        <input list="networks" id="network" name="network"/>
                        <datalist id="networks"></datalist>
                        <br/>
                        <b>Group</b>
                        <input id="group" name="group"/>
                        <input type="button" value="Create" onClick="createGroup()" />
                        <br />
                        <b>Group List</b>
                        <select id="groupList" onChange="changeGroups()">
                        </select>
                        <br />
                        <input type="button" value="Refresh Groups" onClick="refreshGroups()"/>
                        <br />
                        <b>Units</b>
                        <input type="text" id="units"/>
                    </form>
                </div>
            </>
        );
    }
}
