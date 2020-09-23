var formulaire_post = document.getElementById('swup');
var bouton_fermer = document.querySelector('.bouton-fermer')
var poster = document.querySelector('#pattern-switcher')

bouton_fermer.addEventListener('click', function() {
    formulaire_post.classList.remove('show')
}, false)

poster.addEventListener('click', function() {
    formulaire_post.classList.add('show')
}, false)