// type that represents json data that is sent from extension to webview, called ExtensionMessage and has 'type' enum which can be 'plusButtonClicked' or 'settingsButtonClicked' or 'hello'

import { GitCommit } from "../utils/git"
import { ApiConfiguration, ModelInfo } from "./api"
import { AutoApprovalSettings } from "./AutoApprovalSettings"
import { BrowserSettings } from "./BrowserSettings"
import { ChatSettings } from "./ChatSettings"
import { HistoryItem } from "./HistoryItem"
import { McpServer, McpMarketplaceCatalog, McpMarketplaceItem, McpDownloadResponse, McpViewTab } from "./mcp"
import { TelemetrySetting } from "./TelemetrySetting"
import type { BalanceResponse, UsageTransaction, PaymentTransaction } from "../shared/ClineAccount"

// webview will hold state
export interface ExtensionMessage {
	type:
		| "action"
		| "state"
		| "selectedImages"
		| "ollamaModels"
		| "lmStudioModels"
		| "theme"
		| "workspaceUpdated"
		| "invoke"
		| "partialMessage"
		| "openRouterModels"
		| "openAiModels"
		| "requestyModels"
		| "mcpServers"
		| "relinquishControl"
		| "vsCodeLmModels"
		| "requestVsCodeLmModels"
		| "authCallback"
		| "mcpMarketplaceCatalog"
		| "mcpDownloadDetails"
		| "commitSearchResults"
		| "openGraphData"
		| "isImageUrlResult"
		| "didUpdateSettings"
		| "addRemoteServerResult"
		| "userCreditsBalance"
		| "userCreditsUsage"
		| "userCreditsPayments"
		| "totalTasksSize"
		| "addToInput"
		| "browserConnectionResult"
		| "browserConnectionInfo"
		| "detectedChromePath"
		| "scrollToSettings"
		| "browserRelaunchResult"
		| "relativePathsResponse" // Handles single and multiple path responses
		| "fileSearchResults"
	text?: string
	paths?: (string | null)[] // Used for relativePathsResponse
	action?:
		| "chatButtonClicked"
		| "mcpButtonClicked"
		| "settingsButtonClicked"
		| "historyButtonClicked"
		| "didBecomeVisible"
		| "accountLoginClicked"
		| "accountLogoutClicked"
		| "accountButtonClicked"
	invoke?: Invoke
	state?: ExtensionState
	images?: string[]
	ollamaModels?: string[]
	lmStudioModels?: string[]
	vsCodeLmModels?: { vendor?: string; family?: string; version?: string; id?: string }[]
	filePaths?: string[]
	partialMessage?: ClineMessage
	openRouterModels?: Record<string, ModelInfo>
	openAiModels?: string[]
	requestyModels?: Record<string, ModelInfo>
	mcpServers?: McpServer[]
	customToken?: string
	mcpMarketplaceCatalog?: McpMarketplaceCatalog
	error?: string
	mcpDownloadDetails?: McpDownloadResponse
	commits?: GitCommit[]
	openGraphData?: {
		title?: string
		description?: string
		image?: string
		url?: string
		siteName?: string
		type?: string
	}
	url?: string
	isImage?: boolean
	userCreditsBalance?: BalanceResponse
	userCreditsUsage?: UsageTransaction[]
	userCreditsPayments?: PaymentTransaction[]
	totalTasksSize?: number | null
	success?: boolean
	endpoint?: string
	isBundled?: boolean
	isConnected?: boolean
	isRemote?: boolean
	host?: string
	mentionsRequestId?: string
	results?: Array<{
		path: string
		type: "file" | "folder"
		label?: string
	}>
	addRemoteServerResult?: {
		success: boolean
		serverName: string
		error?: string
	}
	tab?: McpViewTab
}

export type Invoke = "sendMessage" | "primaryButtonClick" | "secondaryButtonClick"

export type Platform = "aix" | "darwin" | "freebsd" | "linux" | "openbsd" | "sunos" | "win32" | "unknown"

export const DEFAULT_PLATFORM = "unknown"

export interface ExtensionState {
	apiConfiguration?: ApiConfiguration
	autoApprovalSettings: AutoApprovalSettings
	browserSettings: BrowserSettings
	remoteBrowserHost?: string
	chatSettings: ChatSettings
	checkpointTrackerErrorMessage?: string
	clineMessages: ClineMessage[]
	currentTaskItem?: HistoryItem
	customInstructions?: string
	mcpMarketplaceEnabled?: boolean
	planActSeparateModelsSetting: boolean
	platform: Platform
	shouldShowAnnouncement: boolean
	taskHistory: HistoryItem[]
	telemetrySetting: TelemetrySetting
	uriScheme?: string
	userInfo?: {
		displayName: string | null
		email: string | null
		photoURL: string | null
	}
	version: string
	vscMachineId: string
}

export interface ClineMessage {
	ts: number
	type: "ask" | "say"
	ask?: ClineAsk
	say?: ClineSay
	text?: string
	reasoning?: string
	images?: string[]
	partial?: boolean
	lastCheckpointHash?: string
	isCheckpointCheckedOut?: boolean
	conversationHistoryIndex?: number
	conversationHistoryDeletedRange?: [number, number] // for when conversation history is truncated for API requests
}

export type ClineAsk =
	| "followup"
	| "plan_mode_respond"
	| "command"
	| "command_output"
	| "completion_result"
	| "tool"
	| "api_req_failed"
	| "resume_task"
	| "resume_completed_task"
	| "mistake_limit_reached"
	| "auto_approval_max_req_reached"
	| "browser_action_launch"
	| "use_mcp_server"
	| "new_task"

export type ClineSay =
	| "task"
	| "error"
	| "api_req_started"
	| "api_req_finished"
	| "text"
	| "reasoning"
	| "completion_result"
	| "user_feedback"
	| "user_feedback_diff"
	| "api_req_retried"
	| "command"
	| "command_output"
	| "tool"
	| "shell_integration_warning"
	| "browser_action_launch"
	| "browser_action"
	| "browser_action_result"
	| "mcp_server_request_started"
	| "mcp_server_response"
	| "use_mcp_server"
	| "diff_error"
	| "deleted_api_reqs"
	| "clineignore_error"
	| "checkpoint_created"
	| "load_mcp_documentation"

export interface ClineSayTool {
	tool:
		| "editedExistingFile"
		| "newFileCreated"
		| "readFile"
		| "listFilesTopLevel"
		| "listFilesRecursive"
		| "listCodeDefinitionNames"
		| "searchFiles"
	path?: string
	diff?: string
	content?: string
	regex?: string
	filePattern?: string
}

// must keep in sync with system prompt
export const browserActions = ["launch", "click", "type", "scroll_down", "scroll_up", "close"] as const
export type BrowserAction = (typeof browserActions)[number]

export interface ClineSayBrowserAction {
	action: BrowserAction
	coordinate?: string
	text?: string
}

export type BrowserActionResult = {
	screenshot?: string
	logs?: string
	currentUrl?: string
	currentMousePosition?: string
}

export interface BrowserConnectionInfo {
	isConnected: boolean
	isRemote: boolean
	host?: string
}

export interface ClineAskUseMcpServer {
	serverName: string
	type: "use_mcp_tool" | "access_mcp_resource"
	toolName?: string
	arguments?: string
	uri?: string
}

export interface ClinePlanModeResponse {
	response: string
	options?: string[]
	selected?: string
}

export interface ClineAskQuestion {
	question: string
	options?: string[]
	selected?: string
}

export interface ClineAskNewTask {
	context: string
}

export interface ClineApiReqInfo {
	request?: string
	tokensIn?: number
	tokensOut?: number
	cacheWrites?: number
	cacheReads?: number
	cost?: number
	cancelReason?: ClineApiReqCancelReason
	streamingFailedMessage?: string
}

export type ClineApiReqCancelReason = "streaming_failed" | "user_cancelled"

export const COMPLETION_RESULT_CHANGES_FLAG = "HAS_CHANGES"
