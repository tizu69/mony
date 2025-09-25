import { store } from '$lib/monystore';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const project = store.getProject(params.project);
	if (!project) error(404, 'Project Not Found');
	store.current.lastProject = project.id;
	return { project };
};
