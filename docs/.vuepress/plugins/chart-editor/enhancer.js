import PerfectScrollbar from 'vue2-perfect-scrollbar';
import ChartEditor from './components/ChartEditor.vue';
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css';
import './styles/index.styl';

export default ({ Vue }) => {
	Vue.use(PerfectScrollbar, {
		options: {
			wheelPropagation: false,
		}
	});

	Vue.component('ChartEditor', ChartEditor);
}
