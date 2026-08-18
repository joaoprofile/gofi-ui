import { type ComponentType } from 'react';
import { IntroducaoPage } from './Introducao';
import { InstalacaoPage } from './Instalacao';
import { TokensPage, CoresPage, TipografiaPage, TemaPage } from './Foundations';
import { LayoutPage } from './LayoutPage';
import { ButtonPage } from './ButtonPage';
import { BadgePage } from './BadgePage';
import { AvatarPage } from './AvatarPage';
import { FeedbackPage } from './FeedbackPage';
import { ProgressPage } from './ProgressPage';
import { TooltipPage } from './TooltipPage';
import { FieldPage } from './FieldPage';
import { InputPage } from './InputPage';
import { TextareaPage } from './TextareaPage';
import { SelectPage } from './SelectPage';
import { DatePickerPage } from './DatePickerPage';
import { TogglePage } from './TogglePage';
import { SegmentedControlPage } from './SegmentedControlPage';
import { CardPage } from './CardPage';
import { ListPage } from './ListPage';
import { TablePage } from './TablePage';
import { TabsPage } from './TabsPage';
import { AccordionPage } from './AccordionPage';
import { StepperPage } from './StepperPage';
import { PaginationPage } from './PaginationPage';
import { EmptyStatePage } from './EmptyStatePage';
import { ModalPage } from './ModalPage';
import { ToastPage } from './ToastPage';
import { BannerPage } from './BannerPage';
import { MenuPage } from './MenuPage';
import { ShowcasePage } from './ShowcasePage';
import { ShowcaseHomePage } from './ShowcaseHome';
import { GofiLearnPage } from './GofiLearnPage';
import { CrmPage } from './CrmPage';
import { ChartsPage } from './ChartsPage';
import { VendasPage } from './VendasPage';
import { IndicadoresPage } from './IndicadoresPage';
import { FinancasPage } from './FinancasPage';
import { ErpPage } from './ErpPage';

/** Route-id → page map. Keys match the ids in nav.ts. */
export const pages: Record<string, ComponentType> = {
  introducao: IntroducaoPage,
  instalacao: InstalacaoPage,
  tokens: TokensPage,
  cores: CoresPage,
  tipografia: TipografiaPage,
  tema: TemaPage,
  layout: LayoutPage,
  button: ButtonPage,
  badge: BadgePage,
  avatar: AvatarPage,
  feedback: FeedbackPage,
  progress: ProgressPage,
  tooltip: TooltipPage,
  field: FieldPage,
  input: InputPage,
  textarea: TextareaPage,
  select: SelectPage,
  datepicker: DatePickerPage,
  toggle: TogglePage,
  'segmented-control': SegmentedControlPage,
  card: CardPage,
  list: ListPage,
  table: TablePage,
  tabs: TabsPage,
  accordion: AccordionPage,
  stepper: StepperPage,
  pagination: PaginationPage,
  'empty-state': EmptyStatePage,
  modal: ModalPage,
  toast: ToastPage,
  banner: BannerPage,
  menu: MenuPage,
  showcase: ShowcaseHomePage,
  'app-shell': ShowcasePage,
  learn: GofiLearnPage,
  crm: CrmPage,
  charts: ChartsPage,
  vendas: VendasPage,
  indicadores: IndicadoresPage,
  financas: FinancasPage,
  erp: ErpPage,
};
