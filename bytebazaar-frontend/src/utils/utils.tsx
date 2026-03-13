export function getCookie(cname:string) {
    function escape(s:any) { return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1'); }
    var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(cname) + '=([^;]*)'));
    return match ? match[1] : null;
}