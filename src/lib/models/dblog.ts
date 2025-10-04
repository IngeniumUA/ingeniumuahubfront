export interface DBLogFieldEditI {
	column_name: string
	field_type: string
	value_previous: string | null
	value_new: string | null
}

export interface DBLogI {
	log_id: number
	request_id: string

	table_name: string
	row_primary_key: number

	fields_edited: DBLogFieldEditI[]
	dblog_metadata: Record<string, never>

	created_timestamp: string
}

export interface DBLogExplodedI extends DBLogFieldEditI {
	log_id: number
	request_id: string

	table_name: string
	row_primary_key: number
	created_timestamp: string

	dblog_metadata: Record<string, never>
}