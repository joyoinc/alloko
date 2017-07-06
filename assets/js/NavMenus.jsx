
class NavMenuItem extends React.Component {
    render(props) {
        return <li className={this.props.className} ><a href="">{this.props.text}</a></li>
    }
}

class NavMenus extends React.Component {

    render(props) {
        
        var style = `nav navbar-nav ${this.props.fangdao=="right" ? "navbar-right" : ""}`;
        const menulist = this.props.neirong.map((e, index) => {
            var style = index==0 ? "active" : "";
            return <NavMenuItem key={e.toString()} text={e} className={style} />
            }
        );

        return <ul className={style} >
            {menulist}
        </ul>
    }
}

//export default new NavMenus();
window.NavMenus = NavMenus;