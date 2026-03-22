import {
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	contentWidthArr,
	backgroundColors,
	ArticleStateType,
	defaultArticleState,
} from 'src/constants/articleProps';
import { useEffect, useRef, useState, FormEvent } from 'react';
import clsx from 'clsx';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	currentState: ArticleStateType;
	onApply: (state: ArticleStateType) => void;
	onReset: () => void;
};

export const ArticleParamsForm = ({
	currentState,
	onApply,
	onReset,
}: ArticleParamsFormProps) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const [formState, setFormState] = useState<ArticleStateType>(currentState);

	const updateField =
		<K extends keyof ArticleStateType>(key: K) =>
		(value: ArticleStateType[K]) => {
			setFormState((prev) => ({ ...prev, [key]: value }));
		};

	useEffect(() => {
		if (!isSidebarOpen) return;

		setFormState(currentState);

		const onDocumentMouseDown = (e: MouseEvent) => {
			const container = containerRef.current;
			if (!container) return;
			if (!container.contains(e.target as Node)) setIsSidebarOpen(false);
		};

		document.addEventListener('mousedown', onDocumentMouseDown);
		return () => document.removeEventListener('mousedown', onDocumentMouseDown);
	}, [currentState, isSidebarOpen]);

	const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onApply(formState);
	};

	const handleFormReset = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFormState(defaultArticleState);
		onReset();
	};

	const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

	return (
		<div ref={containerRef}>
			<ArrowButton isOpen={isSidebarOpen} onClick={toggleSidebar} />
			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isSidebarOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleFormSubmit}
					onReset={handleFormReset}>
					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={formState.fontFamilyOption}
						onChange={updateField('fontFamilyOption')}
					/>
					<Select
						title='Размер шрифта'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={updateField('fontSizeOption')}
					/>
					<Separator />

					<RadioGroup
						name='fontColor'
						options={fontColors}
						selected={formState.fontColor}
						title='Цвет шрифта'
						onChange={updateField('fontColor')}
					/>
					<Separator />

					<RadioGroup
						name='backgroundColor'
						options={backgroundColors}
						selected={formState.backgroundColor}
						title='Цвет фона'
						onChange={updateField('backgroundColor')}
					/>
					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={formState.contentWidth}
						onChange={updateField('contentWidth')}
					/>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</div>
	);
};
