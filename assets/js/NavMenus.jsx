
class NavMenuItem extends React.Component {
    render(props) {
        return <li className={this.props.className} ><a href={this.props.link}>{this.props.text}</a></li>
    }
}

class NavMenus extends React.Component {

    render(props) {
        var isRightNavBar = this.props.fangdao == "right"
        var style = `nav navbar-nav ${isRightNavBar ? "navbar-right" : ""}`;
        const menulist = this.props.neirong.map((e, index) => {
            var style = index==0 ? "active" : "";
            var link = `/${e}${isRightNavBar ? "" : ".html"}`;
            return <NavMenuItem key={e.toString()} text={e} link={link} className={style} />
            }
        );

        return <ul className={style} >
            {menulist}
        </ul>
    }
}

//export default new NavMenus();
window.NavMenus = NavMenus;